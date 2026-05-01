import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import api from '../../services/api';

const nodeTypes = {
  familyNode: FamilyNode,
};

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 120, nodesep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 120 });
  });

  edges.forEach((edge) => {
    if (edge.data?.relation === 'spouse') {
      dagreGraph.setEdge(edge.source, edge.target, { minlen: 0, weight: 1 });
    } else {
      dagreGraph.setEdge(edge.source, edge.target, { minlen: 1, weight: 2 });
    }
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - 90,
      y: nodeWithPosition.y - 60,
    };
    return node;
  });

  return { nodes, edges };
};

const SharedTreeView = () => {
  const { shareToken } = useParams();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [treeName, setTreeName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [error, setError] = useState(null);

  // Detail modal (read-only)
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tree info
      const treeRes = await api.get(`/trees/share/${shareToken}`);
      const tree = treeRes.data.data;
      setTreeName(tree.name);
      const owner = tree.createdBy;
      if (owner) {
        setOwnerName(owner.name || `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Anonim');
      }

      // Fetch persons
      const personsRes = await api.get(`/trees/share/${shareToken}/persons`);
      const persons = personsRes.data.data;

      if (persons.length === 0) {
        setLoading(false);
        return;
      }

      const newNodes = [];
      const newEdges = [];
      let hasAnyCustomPosition = false;

      persons.forEach((person) => {
        const hasSavedPosition = person.positionX !== null && person.positionX !== undefined
          && person.positionY !== null && person.positionY !== undefined;
        if (hasSavedPosition) hasAnyCustomPosition = true;

        newNodes.push({
          id: person._id,
          type: 'familyNode',
          position: hasSavedPosition
            ? { x: person.positionX, y: person.positionY }
            : { x: 0, y: 0 },
          data: {
            name: `${person.firstName} ${person.lastName}`.trim(),
            gender: person.gender,
            birthDate: person.birthDate,
            deathDate: person.deathDate,
            photoUrl: person.photoUrl,
            isRoot: person.isRoot,
            parents: person.parents,
            children: person.children,
            spouses: person.spouses,
          },
        });

        if (person.children && person.children.length > 0) {
          person.children.forEach(child => {
            newEdges.push({
              id: `e${person._id}-${child._id || child}`,
              source: person._id,
              target: child._id || child,
              sourceHandle: 'bottom',
              type: 'smoothstep',
              animated: true,
            });
          });
        }

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
                style: { strokeDasharray: '5,5', stroke: '#94a3b8', strokeWidth: 2 },
              });
            }
          });
        }
      });

      if (!hasAnyCustomPosition) {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      } else {
        setNodes(newNodes);
        setEdges(newEdges);
      }
    } catch (err) {
      console.error('Failed to load shared tree:', err);
      if (err.response?.status === 404) {
        setError('Silsilah tidak ditemukan atau link sudah tidak aktif.');
      } else {
        setError('Gagal memuat data silsilah.');
      }
    } finally {
      setLoading(false);
    }
  }, [shareToken, setNodes, setEdges]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center max-w-md">
          <div className="bg-red-50 text-red-500 p-4 rounded-full mb-6 inline-block">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Link Tidak Valid</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col relative">
      {/* Info overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur p-4 rounded-xl shadow-sm border border-slate-200 max-w-72">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded-full">Read-only</span>
        </div>
        <h2 className="font-semibold text-slate-800 text-lg">{treeName}</h2>
        {ownerName && (
          <p className="text-xs text-slate-500 mb-3">Dibuat oleh: {ownerName}</p>
        )}
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Anda melihat silsilah ini dalam mode baca saja. Klik node untuk melihat detail.
        </p>
        <Link 
          to="/"
          className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-slate-900 text-white hover:bg-slate-900/90 h-9 px-3"
        >
          Kembali ke Beranda
        </Link>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
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
          onClose={() => { setIsDetailModalOpen(false); setSelectedNode(null); }}
          isReadOnly={true}
        />
      )}
    </div>
  );
};

export default SharedTreeView;
