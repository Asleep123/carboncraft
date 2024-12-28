import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ReactNode } from "react";
import { MessageCircleIcon } from "lucide-react";

export default function TestNode({ data }: { data: { label: string } }) {
    return (
        <div>
            <Handle type="target" position={Position.Top} />
            <Card className="bg-background rounded-md border border-border">
                <div className="flex space-x-2">
                    <CardHeader>
                        <MessageCircleIcon />
                    </CardHeader>
                    <CardContent className="flex items-center p-0 pr-4">
                        <p>Send Message</p>
                    </CardContent>
                </div>
            </Card>
            <Handle type="source" position={Position.Bottom} id="testEdge" />
        </div>
    )
}