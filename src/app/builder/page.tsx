"use client"

import {
	Background,
	BackgroundVariant,
	ReactFlow,
	ReactFlowProvider,
	addEdge,
	useEdgesState,
	useNodesState
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import * as React from "react"
import { Button } from "~/components/ui/button"

const initialNodes = [
	{ id: "1", position: { x: 0, y: 0 }, data: { label: "hi" } },
	{ id: "2", position: { x: 0, y: 100 }, data: { label: "hi" } },
	{ id: "3", position: { x: 0, y: 200 }, data: { label: "bonjour" } }
]
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }]

export default function Wrapper() {
	return (
		<ReactFlowProvider>
			<Builder />
		</ReactFlowProvider>
	)
}

function Builder() {
	const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

	const onConnect = React.useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	)

	return (
		<div className="w-[100vw] h-[100vh]">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
			/>
			<Background
				variant={BackgroundVariant.Dots}
				gap={18}
				size={2}
				color="#525252"
			/>
			<Button>Save</Button>
		</div>
	)
}
