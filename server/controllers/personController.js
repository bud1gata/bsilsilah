const Person = require('../models/Person');

// @route   GET /api/persons
// @desc    Get all family members belonging to the current user (across all trees)
exports.getAll = async (req, res) => {
  try {
    const persons = await Person.find({ createdBy: req.user._id })
      .populate('parents', 'firstName lastName gender')
      .populate('spouses', 'firstName lastName gender')
      .populate('children', 'firstName lastName gender')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: persons,
    });
  } catch (error) {
    console.error('GetAll error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data anggota keluarga.',
    });
  }
};

// @route   GET /api/trees/:treeId/persons
// @desc    Get all family members for a specific tree
exports.getPersonsByTree = async (req, res) => {
  try {
    // Auto-migration for this specific tree if it's the default one (or just run globally)
    const orphanedPersons = await Person.find({ createdBy: req.user._id, treeId: { $exists: false } });
    if (orphanedPersons.length > 0) {
      let defaultTree = await Tree.findOne({ createdBy: req.user._id, name: 'Silsilah Lama (Migrasi)' });
      if (!defaultTree) {
        defaultTree = await Tree.create({
          name: 'Silsilah Lama (Migrasi)',
          description: 'Silsilah yang dibuat sebelum pembaruan sistem.',
          createdBy: req.user._id
        });
      }
      await Person.updateMany(
        { createdBy: req.user._id, treeId: { $exists: false } },
        { treeId: defaultTree._id }
      );
    }

    const persons = await Person.find({ createdBy: req.user._id, treeId: req.params.treeId })
      .populate('parents', 'firstName lastName gender')
      .populate('spouses', 'firstName lastName gender')
      .populate('children', 'firstName lastName gender')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: persons,
    });
  } catch (error) {
    console.error('GetPersonsByTree error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data silsilah.',
    });
  }
};

// @route   GET /api/persons/:id
// @desc    Get a single person by ID
exports.getById = async (req, res) => {
  try {
    const person = await Person.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    })
      .populate('parents', 'firstName lastName gender birthDate')
      .populate('spouses', 'firstName lastName gender birthDate')
      .populate('children', 'firstName lastName gender birthDate');

    if (!person) {
      return res.status(404).json({
        success: false,
        message: 'Anggota keluarga tidak ditemukan.',
      });
    }

    res.json({
      success: true,
      data: person,
    });
  } catch (error) {
    console.error('GetById error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data anggota keluarga.',
    });
  }
};

// @route   POST /api/persons
// @desc    Create a new person (first/root node or standalone)
exports.create = async (req, res) => {
  try {
    const { firstName, lastName, gender, birthDate, birthPlace, deathDate, deathPlace, photoUrl, bio, isRoot, treeId } = req.body;

    if (!treeId) {
      return res.status(400).json({ success: false, message: 'treeId wajib disertakan.' });
    }

    // If isRoot, unset any existing root for THIS tree
    if (isRoot) {
      await Person.updateMany(
        { treeId: treeId, isRoot: true },
        { isRoot: false }
      );
    }

    const person = await Person.create({
      firstName,
      lastName,
      gender,
      birthDate: birthDate || null,
      birthPlace,
      deathDate: deathDate || null,
      deathPlace,
      photoUrl,
      bio,
      isRoot: isRoot || false,
      treeId,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Anggota keluarga berhasil ditambahkan.',
      data: person,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. '),
      });
    }
    console.error('Create error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan anggota keluarga.',
    });
  }
};

// @route   PUT /api/persons/:id
// @desc    Update person details
exports.update = async (req, res) => {
  try {
    const { firstName, lastName, gender, birthDate, birthPlace, deathDate, deathPlace, photoUrl, bio, isRoot, positionX, positionY } = req.body;

    const person = await Person.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: 'Anggota keluarga tidak ditemukan.',
      });
    }

    // If setting as root, unset any existing root in THIS tree
    if (isRoot && !person.isRoot) {
      await Person.updateMany(
        { treeId: person.treeId, isRoot: true },
        { isRoot: false }
      );
    }

    // Update fields
    if (firstName !== undefined) person.firstName = firstName;
    if (lastName !== undefined) person.lastName = lastName;
    if (gender !== undefined) person.gender = gender;
    if (birthDate !== undefined) person.birthDate = birthDate || null;
    if (birthPlace !== undefined) person.birthPlace = birthPlace;
    if (deathDate !== undefined) person.deathDate = deathDate || null;
    if (deathPlace !== undefined) person.deathPlace = deathPlace;
    if (photoUrl !== undefined) person.photoUrl = photoUrl;
    if (bio !== undefined) person.bio = bio;
    if (isRoot !== undefined) person.isRoot = isRoot;
    if (positionX !== undefined) person.positionX = positionX;
    if (positionY !== undefined) person.positionY = positionY;

    await person.save();

    res.json({
      success: true,
      message: 'Data anggota keluarga berhasil diperbarui.',
      data: person,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui data anggota keluarga.',
    });
  }
};

// @route   DELETE /api/persons/:id
// @desc    Delete a person and clean up all their relations
exports.remove = async (req, res) => {
  try {
    const person = await Person.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: 'Anggota keluarga tidak ditemukan.',
      });
    }

    const personId = person._id;

    // Remove this person from all relations in other documents
    // Remove from parents' children array
    await Person.updateMany(
      { children: personId, createdBy: req.user._id },
      { $pull: { children: personId } }
    );

    // Remove from children's parents array
    await Person.updateMany(
      { parents: personId, createdBy: req.user._id },
      { $pull: { parents: personId } }
    );

    // Remove from spouses' spouses array
    await Person.updateMany(
      { spouses: personId, createdBy: req.user._id },
      { $pull: { spouses: personId } }
    );

    await Person.deleteOne({ _id: personId });

    res.json({
      success: true,
      message: 'Anggota keluarga berhasil dihapus beserta semua relasinya.',
    });
  } catch (error) {
    console.error('Remove error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus anggota keluarga.',
    });
  }
};

// @route   POST /api/persons/:id/relation
// @desc    Add a relation (parent, child, or spouse) to a person
// @body    { relationType: 'parent'|'child'|'spouse', targetId?: string, newPerson?: { firstName, gender, ... } }
exports.addRelation = async (req, res) => {
  try {
    const { relationType, targetId, newPerson } = req.body;

    // Find the source person
    const sourcePerson = await Person.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!sourcePerson) {
      return res.status(404).json({
        success: false,
        message: 'Anggota keluarga sumber tidak ditemukan.',
      });
    }

    let targetPerson;

    // Either link to existing person or create a new one
    if (targetId) {
      targetPerson = await Person.findOne({
        _id: targetId,
        createdBy: req.user._id,
      });
      if (!targetPerson) {
        return res.status(404).json({
          success: false,
          message: 'Anggota keluarga target tidak ditemukan.',
        });
      }
    } else if (newPerson) {
      targetPerson = await Person.create({
        ...newPerson,
        treeId: sourcePerson.treeId, // Inherit treeId from source
        createdBy: req.user._id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Harus menyertakan targetId atau newPerson.',
      });
    }

    // Create bidirectional relation
    switch (relationType) {
      case 'parent':
        // Source's parent is target; target's child is source
        if (!sourcePerson.parents.includes(targetPerson._id)) {
          sourcePerson.parents.push(targetPerson._id);
        }
        if (!targetPerson.children.includes(sourcePerson._id)) {
          targetPerson.children.push(sourcePerson._id);
        }
        break;

      case 'child':
        // Source's child is target; target's parent is source
        if (!sourcePerson.children.includes(targetPerson._id)) {
          sourcePerson.children.push(targetPerson._id);
        }
        if (!targetPerson.parents.includes(sourcePerson._id)) {
          targetPerson.parents.push(sourcePerson._id);
        }
        break;

      case 'spouse':
        // Bidirectional spouse link
        if (!sourcePerson.spouses.includes(targetPerson._id)) {
          sourcePerson.spouses.push(targetPerson._id);
        }
        if (!targetPerson.spouses.includes(sourcePerson._id)) {
          targetPerson.spouses.push(sourcePerson._id);
        }
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Tipe relasi tidak valid. Gunakan 'parent', 'child', atau 'spouse'.",
        });
    }

    await sourcePerson.save();
    await targetPerson.save();

    res.status(201).json({
      success: true,
      message: `Relasi ${relationType} berhasil ditambahkan.`,
      data: {
        source: sourcePerson,
        target: targetPerson,
      },
    });
  } catch (error) {
    console.error('AddRelation error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan relasi.',
    });
  }
};

// @route   PUT /api/persons/:id/relation/:targetId
// @desc    Change relation type between two existing persons
exports.changeRelationType = async (req, res) => {
  try {
    const { newRelationType } = req.body;
    const { id, targetId } = req.params;

    if (!['parent', 'child', 'spouse'].includes(newRelationType)) {
      return res.status(400).json({ success: false, message: 'Tipe relasi tidak valid.' });
    }

    const person1 = await Person.findOne({ _id: id, createdBy: req.user._id });
    const person2 = await Person.findOne({ _id: targetId, createdBy: req.user._id });

    if (!person1 || !person2) {
      return res.status(404).json({ success: false, message: 'Anggota keluarga tidak ditemukan.' });
    }

    // Remove existing connections between person1 and person2
    person1.parents.pull(person2._id);
    person1.children.pull(person2._id);
    person1.spouses.pull(person2._id);

    person2.parents.pull(person1._id);
    person2.children.pull(person1._id);
    person2.spouses.pull(person1._id);

    // Add new connection based on perspective of id (person1)
    if (newRelationType === 'parent') {
      // person2 is parent of person1
      person1.parents.push(person2._id);
      person2.children.push(person1._id);
    } else if (newRelationType === 'child') {
      // person2 is child of person1
      person1.children.push(person2._id);
      person2.parents.push(person1._id);
    } else if (newRelationType === 'spouse') {
      person1.spouses.push(person2._id);
      person2.spouses.push(person1._id);
    }

    await person1.save();
    await person2.save();

    res.json({ success: true, message: 'Relasi berhasil diubah.' });
  } catch (error) {
    console.error('Change relation error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah relasi.' });
  }
};
