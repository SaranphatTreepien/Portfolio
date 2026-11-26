"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from "d3-force";
import { FiMaximize, FiMinus, FiPlus, FiRotateCcw } from "react-icons/fi";
import { COUNTED_TOPICS, TOPIC_STYLE, hasSpecialTopic, isYearCategory, matchesTab } from "./topics";
import { useLang } from "../LanguageProvider";
import { THEME_EVENT } from "../site/ThemeToggle";

// Light theme to match the page; topic colors come from topics.js
const YEAR_COLOR = "#26a99e";
const PLAIN_PROJECT_COLOR = "#cbd5e1";
const BEST_RING = "#f59e0b";
const YEAR_SPACING = 260;
const TOPIC_SPACING = 200;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 4;
const LABEL_ZOOM = 1.5;

const buildGraph = (projects) => {
    const nodes = [];
    const links = [];
    const years = new Set();
    const usedTopics = new Set();

    for (const project of projects) {
        const id = `p:${project.slug}`;
        const topics = COUNTED_TOPICS.filter((topic) => hasSpecialTopic(project, topic));
        const year = isYearCategory(project.category) ? String(project.category).trim() : null;
        nodes.push({
            id,
            kind: "project",
            project,
            label: project.title,
            color: topics[0] ? TOPIC_STYLE[topics[0]].color : PLAIN_PROJECT_COLOR,
            r: project.isBest ? 7 : 5,
        });
        if (year) {
            years.add(year);
            links.push({ source: id, target: `y:${year}`, kind: "year" });
        }
        for (const topic of topics) {
            usedTopics.add(topic);
            links.push({ source: id, target: `t:${topic}`, kind: "topic" });
        }
    }

    const sortedYears = [...years].sort();
    sortedYears.forEach((year, i) => {
        nodes.push({ id: `y:${year}`, kind: "year", value: year, label: year, color: YEAR_COLOR, r: 14, order: i - (sortedYears.length - 1) / 2 });
        if (i > 0) links.push({ source: `y:${sortedYears[i - 1]}`, target: `y:${year}`, kind: "timeline" });
    });
    const shownTopics = COUNTED_TOPICS.filter((topic) => usedTopics.has(topic));
    shownTopics.forEach((topic, i) => {
        nodes.push({ id: `t:${topic}`, kind: "topic", value: topic, label: TOPIC_STYLE[topic].label, color: TOPIC_STYLE[topic].color, r: 11, order: i - (shownTopics.length - 1) / 2 });
    });
    return { nodes, links };
};

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" }) : "";

const truncate = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

export default function ExperienceGraph({ projects, focusTab = "all", onSelectFilter, peekYear = null, className = "h-[480px] lg:h-[520px]" }) {
    const { t } = useLang();
    const router = useRouter();
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const viewRef = useRef({ x: 0, y: 0, k: 1 });
    const sizeRef = useRef({ width: 0, height: 0 });
    const hoverRef = useRef(null);
    const pointerRef = useRef(null);
    const frameRef = useRef(0);
    const [tooltip, setTooltip] = useState(null);

    const graph = useMemo(() => buildGraph(projects), [projects]);

    const neighbors = useMemo(() => {
        const map = new Map(graph.nodes.map((node) => [node.id, new Set()]));
        for (const link of graph.links) {
            const source = typeof link.source === "object" ? link.source.id : link.source;
            const target = typeof link.target === "object" ? link.target.id : link.target;
            map.get(source)?.add(target);
            map.get(target)?.add(source);
        }
        return map;
    }, [graph]);

    const isFocused = useCallback(
        (node) => {
            if (focusTab === "all") return true;
            if (node.kind === "project") return matchesTab(node.project, focusTab);
            return node.value === focusTab;
        },
        [focusTab]
    );

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const { width, height } = sizeRef.current;
        const dpr = window.devicePixelRatio || 1;
        const { x, y, k } = viewRef.current;
        const hovered = hoverRef.current;
        const hoveredNeighbors = hovered ? neighbors.get(hovered.id) : null;
        const isLit = (node) => !hovered || node === hovered || hoveredNeighbors.has(node.id);
        // Text and line colours follow the site theme (tokens in app/globals.css)
        const css = getComputedStyle(document.documentElement);
        const token = (name, alpha = 1) => `rgb(${css.getPropertyValue(name).trim() || "16 21 31"} / ${alpha})`;
        const ink = token("--ink");

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.translate(x, y);
        ctx.scale(k, k);

        for (const link of graph.links) {
            const { source, target } = link;
            const touchesHover = hovered && (source === hovered || target === hovered);
            const focused = isFocused(source) && isFocused(target);
            ctx.globalAlpha = touchesHover ? 0.85 : hovered ? 0.04 : focused ? (link.kind === "timeline" ? 0.5 : 0.16) : 0.05;
            ctx.strokeStyle = touchesHover ? hovered.color : link.kind === "timeline" ? YEAR_COLOR : token("--g500");
            ctx.lineWidth = (touchesHover ? 1.6 : link.kind === "timeline" ? 2 : 0.8) / k;
            ctx.setLineDash(link.kind === "timeline" ? [6 / k, 6 / k] : []);
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        for (const node of graph.nodes) {
            const lit = isLit(node);
            const focused = isFocused(node);
            const isHub = node.kind !== "project";
            ctx.globalAlpha = !lit ? 0.12 : focused ? 1 : 0.18;

            ctx.shadowColor = node.color;
            ctx.shadowBlur = isHub || node === hovered ? 10 : 0;
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node === hovered ? node.r + 2 : node.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // The year being read in the list beside the graph gets a soft ring
            if (node.kind === "year" && node.value === peekYear && focusTab === "all") {
                ctx.globalAlpha = 0.35;
                ctx.fillStyle = YEAR_COLOR;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.r + 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.strokeStyle = YEAR_COLOR;
                ctx.lineWidth = 2 / k;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.r + 8, 0, Math.PI * 2);
                ctx.stroke();
            }

            if (isHub && node.value === focusTab) {
                ctx.strokeStyle = ink;
                ctx.lineWidth = 2 / k;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.r + 5, 0, Math.PI * 2);
                ctx.stroke();
            }

            if (node.kind === "project" && node.project.isBest) {
                ctx.strokeStyle = BEST_RING;
                ctx.lineWidth = 1.5 / k;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.r + 3, 0, Math.PI * 2);
                ctx.stroke();
            }

            const showLabel = isHub || node === hovered || (hovered && hoveredNeighbors.has(node.id)) || k >= LABEL_ZOOM;
            if (showLabel && (lit || isHub)) {
                const fontSize = (isHub ? 13 : 11) / Math.max(k, 0.8);
                ctx.font = `${isHub ? 600 : 500} ${fontSize}px Geist, "IBM Plex Sans Thai", system-ui, sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillStyle = isHub ? ink : token("--g700", 0.9);
                ctx.fillText(isHub ? node.label : truncate(node.label, 30), node.x, node.y + node.r + 4);
            }
        }
        ctx.globalAlpha = 1;
    }, [graph, neighbors, isFocused, focusTab, peekYear]);

    const requestDraw = useCallback(() => {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(draw);
    }, [draw]);

    // Repaint when the visitor switches light / dark
    useEffect(() => {
        window.addEventListener(THEME_EVENT, requestDraw);
        return () => window.removeEventListener(THEME_EVENT, requestDraw);
    }, [requestDraw]);

    const fitToView = useCallback(() => {
        const { width, height } = sizeRef.current;
        if (!width || !graph.nodes.length) return;
        const xs = graph.nodes.map((node) => node.x);
        const ys = graph.nodes.map((node) => node.y);
        const minX = Math.min(...xs) - 60;
        const maxX = Math.max(...xs) + 60;
        const minY = Math.min(...ys) - 110; // leave room for the legend overlay
        const maxY = Math.max(...ys) + 60;
        const k = Math.min(width / (maxX - minX), height / (maxY - minY), 1.4);
        viewRef.current = { k, x: width / 2 - ((minX + maxX) / 2) * k, y: height / 2 - ((minY + maxY) / 2) * k };
        requestDraw();
    }, [graph, requestDraw]);

    // Layout is computed up front (no "explosion" animation); the simulation only wakes up while dragging.
    const simulation = useMemo(() => {
        const sim = forceSimulation(graph.nodes)
            .force(
                "link",
                forceLink(graph.links)
                    .id((node) => node.id)
                    .distance((link) => (link.kind === "timeline" ? YEAR_SPACING : link.kind === "year" ? 70 : 110))
                    .strength((link) => (link.kind === "topic" ? 0.08 : link.kind === "timeline" ? 0.3 : 0.6))
            )
            .force("charge", forceManyBody().strength((node) => (node.kind === "project" ? -90 : -500)))
            .force("collide", forceCollide((node) => node.r + 6))
            .force(
                "x",
                forceX((node) => (node.kind === "year" ? node.order * YEAR_SPACING : node.kind === "topic" ? node.order * TOPIC_SPACING : 0)).strength((node) =>
                    node.kind === "project" ? 0.03 : 0.9
                )
            )
            .force("y", forceY((node) => (node.kind === "topic" ? -240 : 0)).strength((node) => (node.kind === "project" ? 0.04 : 0.6)))
            .stop();
        sim.tick(400);
        return sim;
    }, [graph]);

    const initialPositions = useMemo(
        () => new Map(graph.nodes.map((node) => [node.id, { x: node.x, y: node.y }])),
        [graph, simulation]
    );

    const resetLayout = () => {
        simulation.stop();
        for (const node of graph.nodes) {
            const start = initialPositions.get(node.id);
            Object.assign(node, { x: start.x, y: start.y, vx: 0, vy: 0, fx: null, fy: null });
        }
        fitToView();
    };

    useEffect(() => {
        simulation.on("tick", requestDraw);
        return () => simulation.stop();
    }, [simulation, requestDraw]);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        let fitted = false;
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            const dpr = window.devicePixelRatio || 1;
            sizeRef.current = { width, height };
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            if (!fitted) {
                fitted = true;
                fitToView();
            } else {
                requestDraw();
            }
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, [fitToView, requestDraw]);

    useEffect(requestDraw, [requestDraw, focusTab]);

    const toGraphPoint = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const { x, y, k } = viewRef.current;
        return { sx: event.clientX - rect.left, sy: event.clientY - rect.top, gx: (event.clientX - rect.left - x) / k, gy: (event.clientY - rect.top - y) / k };
    };

    const findNode = (gx, gy) => {
        const hitSlop = 6 / viewRef.current.k;
        let best = null;
        let bestDistance = Infinity;
        for (const node of graph.nodes) {
            const distance = Math.hypot(node.x - gx, node.y - gy);
            if (distance < node.r + hitSlop && distance < bestDistance) {
                best = node;
                bestDistance = distance;
            }
        }
        return best;
    };

    const setHover = (node, sx, sy) => {
        if (hoverRef.current !== node) {
            hoverRef.current = node;
            requestDraw();
        }
        canvasRef.current.style.cursor = node ? "pointer" : pointerRef.current ? "grabbing" : "grab";
        setTooltip(node?.kind === "project" ? { node, x: sx, y: sy } : null);
    };

    const zoomBy = (factor, sx = sizeRef.current.width / 2, sy = sizeRef.current.height / 2) => {
        const view = viewRef.current;
        const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.k * factor));
        viewRef.current = { k, x: sx - ((sx - view.x) / view.k) * k, y: sy - ((sy - view.y) / view.k) * k };
        requestDraw();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const onWheel = (event) => {
            if (!event.ctrlKey && !event.metaKey) return; // plain scroll keeps scrolling the page
            event.preventDefault();
            const rect = canvas.getBoundingClientRect();
            zoomBy(Math.exp(-event.deltaY * 0.01), event.clientX - rect.left, event.clientY - rect.top);
        };
        canvas.addEventListener("wheel", onWheel, { passive: false });
        return () => canvas.removeEventListener("wheel", onWheel);
    });

    const onPointerDown = (event) => {
        const { sx, sy, gx, gy } = toGraphPoint(event);
        const node = findNode(gx, gy);
        canvasRef.current.setPointerCapture(event.pointerId);
        pointerRef.current = { node, startX: sx, startY: sy, lastX: sx, lastY: sy, moved: false };
        if (node) {
            node.fx = node.x;
            node.fy = node.y;
            simulation.alphaTarget(0.25).restart();
        }
    };

    const onPointerMove = (event) => {
        const { sx, sy, gx, gy } = toGraphPoint(event);
        const pointer = pointerRef.current;
        if (!pointer) {
            setHover(findNode(gx, gy), sx, sy);
            return;
        }
        if (Math.hypot(sx - pointer.startX, sy - pointer.startY) > 4) pointer.moved = true;
        if (pointer.node) {
            pointer.node.fx = gx;
            pointer.node.fy = gy;
            setTooltip(null);
        } else {
            viewRef.current = { ...viewRef.current, x: viewRef.current.x + sx - pointer.lastX, y: viewRef.current.y + sy - pointer.lastY };
            requestDraw();
        }
        pointer.lastX = sx;
        pointer.lastY = sy;
    };

    const onPointerUp = (event) => {
        const pointer = pointerRef.current;
        pointerRef.current = null;
        if (!pointer) return;
        if (pointer.node) {
            pointer.node.fx = null;
            pointer.node.fy = null;
            simulation.alphaTarget(0);
            if (!pointer.moved && pointer.node.kind === "project") {
                router.push(`/work/${pointer.node.project.slug}`);
                return;
            }
            if (!pointer.moved && onSelectFilter) onSelectFilter(pointer.node.value);
        }
        const { sx, sy, gx, gy } = toGraphPoint(event);
        setHover(findNode(gx, gy), sx, sy);
    };

    const legend = [
        { color: YEAR_COLOR, label: t("graph.year") },
        ...COUNTED_TOPICS.map((topic) => ({ color: TOPIC_STYLE[topic].color, label: TOPIC_STYLE[topic].label })),
    ];

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden rounded-3xl border border-white/80 bg-white/75 bg-[radial-gradient(rgba(148,163,184,0.25)_1px,transparent_1px)] [background-size:20px_20px] shadow-[0_10px_40px_-24px_rgba(16,60,70,0.35)] ${className}`}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full touch-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onPointerLeave={() => !pointerRef.current && setHover(null)}
            />

            <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-x-3 gap-y-1.5 rounded-2xl border border-gray-200 bg-white/90 px-3 py-2 text-[11px] text-gray-600 backdrop-blur max-w-[calc(100%-7rem)]">
                {legend.map((item) => (
                    <span key={item.label} className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                        {item.label}
                    </span>
                ))}
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: BEST_RING }} /> Best
                </span>
            </div>

            <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-500">
                <button type="button" onClick={() => zoomBy(1.3)} className="p-2 hover:bg-gray-50 hover:text-primary" aria-label={t("graph.zoomIn")}><FiPlus /></button>
                <button type="button" onClick={() => zoomBy(1 / 1.3)} className="p-2 hover:bg-gray-50 hover:text-primary" aria-label={t("graph.zoomOut")}><FiMinus /></button>
                <button type="button" onClick={fitToView} className="p-2 hover:bg-gray-50 hover:text-primary" aria-label={t("graph.fit")} title={t("graph.fit")}><FiMaximize /></button>
                <button type="button" onClick={resetLayout} className="border-t border-gray-200 p-2 hover:bg-gray-50 hover:text-primary" aria-label={t("graph.reset")} title={t("graph.reset")}><FiRotateCcw /></button>
            </div>

            <p className="pointer-events-none absolute bottom-3 left-4 text-[11px] text-gray-400">
                {t("graph.help")}
            </p>

            {tooltip && (
                <div
                    className="pointer-events-none absolute z-10 w-64 rounded-xl border border-gray-200 bg-white/95 p-3 text-primary shadow-xl backdrop-blur"
                    style={{
                        left: Math.min(tooltip.x + 14, sizeRef.current.width - 272),
                        top: Math.min(tooltip.y + 14, sizeRef.current.height - 120),
                    }}
                >
                    <p className="text-sm font-bold leading-snug">{tooltip.node.project.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(tooltip.node.project.createdAt)}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {tooltip.node.project.isBest && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">Best</span>}
                        {COUNTED_TOPICS.filter((topic) => hasSpecialTopic(tooltip.node.project, topic)).map((topic) => (
                            <span key={topic} className="rounded px-1.5 py-0.5 text-[10px]" style={{ background: `${TOPIC_STYLE[topic].color}26`, color: TOPIC_STYLE[topic].color }}>
                                {TOPIC_STYLE[topic].label}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
