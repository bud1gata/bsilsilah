import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { FamilyNode } from '../../components/Tree/FamilyNode';
import { NodeModal } from '../../components/Tree/NodeModal';
import { AddRelationModal } from '../../components/Tree/AddRelationModal';

const nodeTypes = {
  familyNode: FamilyNode,
};

// Initial mock data for the tree
const initialNodes = [
  {
    id: '1',
    type: 'familyNode',
    position: { x: 250, y: 50 },
    data: { name: 'Budi Santoso', gender: 'male', birthDate: '1950-01-01', isRoot: true },
  },
  {
    id: '2',
    type: 'familyNode',
    position: { x: 100, y: 200 },
    data: { name: 'Andi Santoso', gender: 'male', birthDate: '1980-05-15' },
  },
  {
    id: '3',
    type: 'familyNode',
    position: { x: 400, y: 200 },
    data: { name: 'Siti Santoso', gender: 'female', birthDate: '1985-08-20' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
  { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', animated: true },
];

const TreeView = () => {
  const { id } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Modals state
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

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

  const handleSaveRelation = (sourceId, type, data) => {
    const newNodeId = (nodes.length + 1).toString();
    
    // Simple logic to place the new node
    const sourceNode = nodes.find(n => n.id === sourceId);
    let newX = sourceNode.position.x;
    let newY = sourceNode.position.y;

    if (type === 'child') {
      newY += 150;
      newX += (Math.random() - 0.5) * 200; // offset a bit
    } else if (type === 'parent') {
      newY -= 150;
    } else if (type === 'spouse') {
      newX += 200;
    }

    const newNode = {
      id: newNodeId,
      type: 'familyNode',
      position: { x: newX, y: newY },
      data: { ...data },
    };

    setNodes((nds) => nds.concat(newNode));

    if (type === 'child') {
      setEdges((eds) => eds.concat({ id: `e${sourceId}-${newNodeId}`, source: sourceId, target: newNodeId, type: 'smoothstep', animated: true }));
    } else if (type === 'parent') {
      setEdges((eds) => eds.concat({ id: `e${newNodeId}-${sourceId}`, source: newNodeId, target: sourceId, type: 'smoothstep', animated: true }));
    } else if (type === 'spouse') {
      // Spouse edge styling could be different (dashed)
      setEdges((eds) => eds.concat({ id: `e${sourceId}-${newNodeId}`, source: sourceId, target: newNodeId, type: 'straight', style: { strokeDasharray: '5,5' } }));
    }

    setIsAddModalOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-50 flex flex-col relative">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-slate-200">
        <h2 className="font-semibold text-slate-800">Silsilah {id === 'new' ? 'Baru' : 'Keluarga'}</h2>
        <p className="text-xs text-slate-500">Klik node untuk melihat detail atau menambah relasi</p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
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

      {isDetailModalOpen && (
        <NodeModal 
          node={selectedNode} 
          onClose={handleCloseDetail} 
          onAddRelation={handleOpenAddRelation}
          onEdit={() => alert('Edit feature placeholder')}
          onDelete={(id) => {
            setNodes((nds) => nds.filter((n) => n.id !== id));
            handleCloseDetail();
          }}
          isReadOnly={false}
        />
      )}

      {isAddModalOpen && (
        <AddRelationModal 
          sourceNode={selectedNode}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveRelation}
        />
      )}
    </div>
  );
};

export default TreeView;
