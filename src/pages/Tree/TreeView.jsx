import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

import { FamilyNode } from '../../components/Tree/FamilyNode';
import { NodeModal } from '../../components/Tree/NodeModal';
import { AddRelationModal } from '../../components/Tree/AddRelationModal';
import { EditNodeModal } from '../../components/Tree/EditNodeModal';
import api from '../../services/api';

const nodeTypes = {
  familyNode: FamilyNode,
};

// Auto-layout utility using dagre
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Set rankdir: TB (Top to Bottom), ranksep (distance between rows), nodesep (distance between nodes)
  dagreGraph.setGraph({ rankdir: direction, ranksep: 120, nodesep: 150 });

  nodes.forEach((node) => {
    // Estimating node dimensions based on FamilyNode component
    dagreGraph.setNode(node.id, { width: 180, height: 120 });
  });

  edges.forEach((edge) => {
    // If it's a spouse edge, we use minlen: 0 to keep them on the same rank
    if (edge.data?.relation === 'spouse') {
      dagreGraph.setEdge(edge.source, edge.target, { minlen: 0, weight: 1 });
    } else {
      dagreGraph.setEdge(edge.source, edge.target, { minlen: 1, weight: 2 });
    }
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // Offset by half dimensions to match ReactFlow's top-left anchor
    node.position = {
      x: nodeWithPosition.x - 90,
      y: nodeWithPosition.y - 60,
    };
    return node;
  });

  return { nodes, edges };
};

const TreeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch Tree Data
  const loadTreeData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/trees/${id}/persons`);
      const persons = response.data.data;

      if (persons.length === 0) {
        // It's a newly created or empty tree, open add modal for Root node immediately
        setIsAddModalOpen(true);
        setLoading(false);
        return;
      }

      // Convert Person data to ReactFlow Nodes & Edges
      const newNodes = [];
      const newEdges = [];
      let hasAnyCustomPosition = false;

      persons.forEach((person) => {
        const hasSavedPosition = person.positionX !== null && person.positionX !== undefined
          && person.positionY !== null && person.positionY !== undefined;
        if (hasSavedPosition) hasAnyCustomPosition = true;

        // Node
        newNodes.push({
          id: person._id,
          type: 'familyNode',
          position: hasSavedPosition
            ? { x: person.positionX, y: person.positionY }
            : { x: 0, y: 0 }, // Will be calculated by dagre if no saved position
          data: { 
            name: `${person.firstName} ${person.lastName}`.trim(), 
            gender: person.gender, 
            birthDate: person.birthDate,
            deathDate: person.deathDate,
            photoUrl: person.photoUrl,
            isRoot: person.isRoot,
            parents: person.parents,
            children: person.children,
            spouses: person.spouses
          },
        });

        // Edges for Children (Source -> Target)
        if (person.children && person.children.length > 0) {
          person.children.forEach(child => {
            newEdges.push({
              id: `e${person._id}-${child._id || child}`,
              source: person._id,
              target: child._id || child,
              sourceHandle: 'bottom',
              type: 'smoothstep',
              animated: true
            });
          });
        }

        // Edges for Spouses (Horizontalish)
        if (person.spouses && person.spouses.length > 0) {
          person.spouses.forEach(spouse => {
            const edgeId1 = `e-spouse-${person._id}-${spouse._id || spouse}`;
            const edgeId2 = `e-spouse-${spouse._id || spouse}-${person._id}`;
            
            if (!newEdges.find(e => e.id === edgeId1 || e.id === edgeId2)) {
              newEdges.push({
                id: edgeId1,
                source: person._id,
                target: spouse._id || spouse,
                sourceHandle: 'right',
                targetHandle: 'left',
                type: 'straight',
                data: { relation: 'spouse' },
                style: { strokeDasharray: '5,5', stroke: '#94a3b8', strokeWidth: 2 }
              });
            }
          });
        }
      });

      // Only auto-layout if no nodes have saved positions
      if (!hasAnyCustomPosition) {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      } else {
        setNodes(newNodes);
        setEdges(newEdges);
      }
      

    } catch (error) {
      console.error("Error loading tree data:", error);
    } finally {
      setLoading(false);
    }
  }, [id, navigate, setNodes, setEdges]);

  useEffect(() => {
    loadTreeData();
  }, [loadTreeData]);

  // Save position when node is dropped after dragging
  const onNodeDragStop = useCallback(async (event, node) => {
    try {
      await api.put(`/persons/${node.id}`, {
        positionX: Math.round(node.position.x),
        positionY: Math.round(node.position.y),
      });
    } catch (err) {
      console.error('Failed to save node position:', err);
    }
  }, []);

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedNode(null);
  };

  const handleOpenAddRelation = (node) => {
    setIsDetailModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (node) => {
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (nodeId, data, relationChanges = []) => {
    try {
      setLoading(true);
      
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        birthDate: data.birthDate || null,
        deathDate: data.deathDate || null,
        photoUrl: data.photoUrl || undefined,
      };

      await api.put(`/persons/${nodeId}`, payload);
      
      // Process queued relation changes
      for (const change of relationChanges) {
        await api.put(`/persons/${nodeId}/relation/${change.targetId}`, {
          newRelationType: change.newType
        });
      }
      
      setIsEditModalOpen(false);
      setSelectedNode(null);
      await loadTreeData();
    } catch (error) {
      console.error("Failed to edit node:", error);
      alert('Gagal memperbarui data.');
      setLoading(false);
    }
  };

  const handleSaveRelation = async (sourceId, type, data) => {
    try {
      setLoading(true);
      
      // Separate name into firstName and lastName (rudimentary)
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const personPayload = {
        firstName,
        lastName,
        gender: data.gender,
        birthDate: data.birthDate || null,
        treeId: id, // Pass treeId from URL params
        photoUrl: data.photoUrl || undefined,
      };

      if (!sourceId) {
        // Creating Root Node
        personPayload.isRoot = true;
        await api.post('/persons', personPayload);
      } else {
        // Creating Relation
        await api.post(`/persons/${sourceId}/relation`, {
          relationType: type,
          newPerson: personPayload
        });
      }

      setIsAddModalOpen(false);
      setSelectedNode(null);
      
      // Reload data from backend to get real IDs and relations
      await loadTreeData();
    } catch (error) {
      console.error("Failed to save relation:", error);
      alert(error.response?.data?.message || 'Gagal menyimpan data.');
      setLoading(false);
    }
  };

  const handleDeleteNode = async (nodeId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus individu ini? Semua relasinya akan terputus.')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/persons/${nodeId}`);
      handleCloseDetail();
      await loadTreeData();
    } catch (error) {
      console.error("Failed to delete node:", error);
      alert('Gagal menghapus anggota keluarga.');
      setLoading(false);
    }
  };

  if (loading && nodes.length === 0 && id !== 'new') {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-50 flex flex-col relative">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur p-4 rounded-xl shadow-sm border border-slate-200 w-64">
        <h2 className="font-semibold text-slate-800 mb-1">Silsilah Keluarga</h2>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">Klik node pada kanvas untuk melihat detail, mengedit, atau menambah relasi anggota keluarga.</p>
        
        <div className="space-y-2">
          {nodes.length === 0 && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 h-9 px-3"
            >
              Tambah Anggota Pertama
            </button>
          )}
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-slate-900 text-white hover:bg-slate-900/90 h-9 px-3"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50"
      >
        <Controls className="bg-white border-slate-200 shadow-sm" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data?.gender === 'male') return '#3b82f6';
            if (n.data?.gender === 'female') return '#ec4899';
            return '#cbd5e1';
          }}
          className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
        />
        <Background color="#cbd5e1" gap={16} size={1} />
      </ReactFlow>

      {isDetailModalOpen && selectedNode && (
        <NodeModal 
          node={selectedNode} 
          onClose={handleCloseDetail} 
          onAddRelation={handleOpenAddRelation}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteNode}
          isReadOnly={false}
        />
      )}

      {isEditModalOpen && selectedNode && (
        <EditNodeModal
          node={selectedNode}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedNode(null);
          }}
          onSave={handleSaveEdit}
        />
      )}

      {isAddModalOpen && (
        <AddRelationModal 
          sourceNode={selectedNode}
          onClose={() => {
            setIsAddModalOpen(false);
          }}
          onSave={handleSaveRelation}
        />
      )}
    </div>
  );
};

export default TreeView;
