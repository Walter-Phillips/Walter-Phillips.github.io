"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LiquidMetal, Water } from "@paper-design/shaders-react";
import { ShaderCanvas } from "@/components/shader-canvas";

function ShaderPreview({ shader }: { shader: string }) {
  if (shader === "meridian") {
    return (
      <LiquidMetal
        speed={1}
        softness={0.1}
        repetition={2}
        shiftRed={0.3}
        shiftBlue={0.3}
        distortion={0.07}
        contour={0.4}
        scale={0.6}
        rotation={0}
        shape="diamond"
        angle={70}
        image="/meridian-logo.png"
        colorBack="#00000000"
        colorTint="#FFFFFF"
        style={{ backgroundColor: "#000000", width: "100%", height: "100%" }}
      />
    );
  }
  if (shader === "zage") {
    return (
      <Water
        speed={0.35}
        size={0.01}
        highlights={0.07}
        layering={0.08}
        edges={0.5}
        waves={0.05}
        caustic={0.05}
        image="/zage-logo-shader.webp"
        scale={0.8}
        fit="contain"
        colorBack="#00000000"
        colorHighlight="#000000"
        style={{ backgroundColor: "#000000", width: "100%", height: "100%" }}
      />
    );
  }
  return <ShaderCanvas shader={shader} />;
}

interface ProjectCardProps {
  title: string;
  description: string;
  href: string;
  label: string;
  shader: string;
  id: string;
}

export function ProjectCard({ title, description, href, label, shader, id }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const showInteractivePreview = hovered && !reduceMotion;
  const motionDuration = reduceMotion ? 0 : 0.3;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      layout
    >
      <AnimatePresence>
        {showInteractivePreview && (
          <motion.div
            className="absolute inset-0 -z-10 hidden rounded-xl border border-border bg-card shadow-md sm:block"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: motionDuration, ease: [0.4, 0, 0.2, 1] }}
            layoutId={`card-bg-${id}`}
          />
        )}
      </AnimatePresence>

      <div className="mb-3 overflow-hidden rounded-lg border border-border/80 bg-card/70 sm:hidden">
        <div className="h-24 w-full">
          <ShaderPreview shader={shader} />
        </div>
      </div>

      <motion.div
        animate={{
          padding: showInteractivePreview ? 16 : 0,
          paddingTop: showInteractivePreview ? 16 : 8,
          paddingBottom: showInteractivePreview ? 16 : 8,
        }}
        transition={{ duration: motionDuration, ease: [0.4, 0, 0.2, 1] }}
      >
        <AnimatePresence>
          {showInteractivePreview && (
            <motion.div
              className="hidden w-full overflow-hidden rounded-md sm:block"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 144, marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: motionDuration, ease: [0.4, 0, 0.2, 1] }}
            >
              <ShaderPreview shader={shader} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
          <div className="min-w-0">
            <motion.p
              className={`text-[15px] leading-6 font-medium transition-colors sm:text-base ${
                hovered ? "text-primary" : "text-foreground"
              } break-words`}
              layoutId={`title-${id}`}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {title}
            </motion.p>
            <motion.p
              className="max-w-xl text-sm leading-6 text-muted-foreground break-words"
              layoutId={`desc-${id}`}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {description}
            </motion.p>
          </div>
          <motion.span
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80 sm:ml-4 sm:shrink-0 sm:pt-0.5 sm:text-[11px]"
            layoutId={`label-${id}`}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {label}
          </motion.span>
        </div>
      </motion.div>
    </motion.a>
  );
}
