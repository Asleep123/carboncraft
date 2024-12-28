"use client"

import {
	Background,
	BackgroundVariant,
	ReactFlow,
	ReactFlowProvider,
	addEdge,
	useEdgesState,
	useNodesState,
	Panel,
	Controls
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import * as React from "react"
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
  } from "~/components/ui/menubar"
  
import { Button } from "~/components/ui/button"
import TestNode from "~/nodes/test"
import { SaveIcon } from "lucide-react"

const initialNodes = [
	{ id: "1", type: "testNode", position: { x: 0, y: 0 }, data: { label: "hi" } },
	{ id: "2", position: { x: 0, y: 100 }, data: { label: "hi" } },
	{ id: "3", position: { x: 100, y: 200 }, data: { label: "bonjour" } }
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

	const nodeTypes = React.useMemo(() => ({ testNode: TestNode }), [])

	const onConnect = React.useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	)

	return (
		<main className="flex flex-col">
			<div className="h-screen w-screen">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
				/>
				<Background
					variant={BackgroundVariant.Dots}
					gap={18}
					size={2}
					color="#525252"
				/>
				<Controls />
				<Panel position="top-left">
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger>Command</MenubarTrigger>
							<MenubarContent>
								<MenubarItem><SaveIcon className="w-4 h-4 mr-2" />Save</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				</Panel>
			</div>
		</main>
	)
}
