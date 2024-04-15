<script setup lang="ts">
import {
    defineGraphConfig,
    defineGraph,
    defineLink,
    defineNode,
    GraphController,
    GraphNode,
    GraphLink,
} from "d3-graph-controller";
// @ts-ignore This is obviously imported...
import Gradient from "javascript-color-gradient";
import { onMounted, onUnmounted, ref } from "vue";
import {
    CalculatorState,
    INITIAL_STATE,
    generateLevelSolutions,
} from "../calculator";
import { Level } from "../calculator/levels";

const { selectedLevel } = defineProps<{
    selectedLevel?: Level;
}>();

const graphMessage = ref("");

type NodeData = {
    value: number;
    colour: string;
    moveIndex: number;
};
type LinkData = {
    source: NodeData;
    target: NodeData;
    label: string;
};
let controller: GraphController;
let nodeObjects: Record<number, GraphNode<string>>;

function renderLevel(level?: Level) {
    const container = document.getElementById(
        "solutionGraph"
    ) as HTMLDivElement;
    const { bottom, right, y } = container.getBoundingClientRect();
    // console.log(top, bottom, left, right, x, y)

    const config = defineGraphConfig<any, any, any>({
        nodeRadius: (node: any) => node.radius,
        simulation: {
            forces: {
                centering: {
                    enabled: false,
                    // strength: (node: GraphNode) => 0,
                },
                link: {
                    enabled: false,
                    // length: (link: any) => link.length,
                },
            },
        },
    });

    if (level === undefined) {
        graphMessage.value = "UNDEFINED LEVEL";
        return;
    }
    const levelSolutions = generateLevelSolutions(level);
    if (levelSolutions.length == 0) {
        graphMessage.value = "NO SOLUTIONS";
        return;
    }

    // ---------
    // The graph
    // ---------
    const nodeGraph: Record<number, NodeData> = {};
    const nodeLinks: Record<number, Record<number, LinkData>> = {};
    const { goal, initial, moves } = level;

    nodeGraph[initial] = {
        value: initial,
        moveIndex: 0,
        colour: "#FF0000",
    };
    nodeGraph[goal] = {
        value: goal,
        moveIndex: moves,
        colour: "#00FF00",
    };

    // Populate nodes and links
    for (const solution of levelSolutions) {
        const colours = new Gradient()
            .setColorGradient("#e38800", "#FFFF00")
            .setMidpoint(solution.length - 1)
            .getColors();

        let current: CalculatorState = {
            ...INITIAL_STATE,
            value: initial,
        };
        for (const [index, operation] of Object.entries(solution)) {
            const prev = current;
            current = operation.eval(current);

            if (nodeGraph[current.value] === undefined) {
                nodeGraph[current.value] = {
                    value: current.value,
                    moveIndex: Number(index) + 1,
                    colour: colours[Number(index)],
                };
            }

            // Links
            if (nodeLinks[prev.value] === undefined) {
                nodeLinks[prev.value] = {};
            }
            if (nodeLinks[prev.value][current.value] === undefined) {
                nodeLinks[prev.value][current.value] = {
                    source: nodeGraph[prev.value],
                    target: nodeGraph[current.value],
                    label: operation.getLabel(prev),
                };
            }
        }
    }

    // Transform nodes and links into objects
    let nodeID = 0;
    nodeObjects = Object.values(nodeGraph).reduce(
        (nodes: Record<number, GraphNode>, data) => {
            nodes[data.value] = defineNode<string, GraphNode<"secondary">>({
                id: `node${nodeID++}`,
                type: "secondary",
                isFocused: false,
                color: data.colour,
                label: {
                    color: "black",
                    fontSize: "1rem",
                    text: data.value.toString(),
                },
                // @ts-ignore It should have this value!!!!!!
                radius: 35,
                fx:
                    data.moveIndex == 0
                        ? 64
                        : data.moveIndex == moves
                        ? right - 64
                        : undefined,
                fy:
                    data.moveIndex == 0
                        ? 64
                        : data.moveIndex == moves
                        ? bottom - y - 64
                        : undefined,
            });

            return nodes;
        },
        {}
    );

    const linkObjects = Object.values(nodeLinks).reduce(
        (links: GraphLink[], data) => {
            const linkData = Object.values(data);
            for (const link of linkData) {
                links.push(
                    defineLink<any, GraphNode, GraphNode, any>({
                        source: nodeObjects[link.source.value],
                        target: nodeObjects[link.target.value],
                        color: "#a3a3a3",
                        label: {
                            color: "black",
                            fontSize: "2rem",
                            text: link.label,
                        },
                        length: 128,
                    })
                );
            }
            return links;
        },
        []
    );

    const graph = defineGraph<any, any, any>({
        nodes: Object.values(nodeObjects),
        links: linkObjects,
    });

    controller = new GraphController(container, graph, config);
    controller.resize();
}

onMounted(() => {
    renderLevel(selectedLevel);
});

onUnmounted(() => {
    controller?.shutdown();
});
</script>

<template>
    <div id="solutionGraph">
        <h1>{{ graphMessage }}</h1>
    </div>
</template>

<style>
#solutionGraph {
    width: 100vw;
    height: 50vh;
    background-color: beige;
}

#solutionGraph h1 {
    color: black;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0px;
}

/**
Graph CSS
*/

.graph,
.graph > svg {
    display: block;
}

.graph {
    height: 100%;
    touch-action: none;
    width: 100%;
}

.graph * {
    -webkit-touch-callout: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
}

.link {
    fill: none;
    stroke-width: 4px;
}

.node {
    --color-stroke: var(--color-node-stroke, rgba(0, 0, 0, 0.5));

    cursor: pointer;
    stroke: none;
    stroke-width: 2px;
    transition: filter 0.25s ease, stroke 0.25s ease,
        stroke-dasharray 0.25s ease;
}

.node:hover:not(.focused) {
    filter: brightness(80%);
    stroke: var(--color-stroke);
    stroke-dasharray: 4px;
}

.node.focused {
    stroke: var(--color-stroke);
}

.link__label {
    pointer-events: none;
    text-anchor: middle;
    outline: 3px solid black;
    border-radius: 4px;
}

.node__label {
    pointer-events: none;
    text-anchor: middle;
}

.grabbed {
    cursor: grabbing !important;
}
</style>
