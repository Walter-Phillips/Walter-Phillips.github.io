import { Fragment, type ReactNode } from "react";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { BlogPostImage } from "@/components/blog-post-image";
import { cn } from "@/lib/utils";

type MarkdownNode = {
  type: string;
  children?: MarkdownNode[];
  value?: string;
  url?: string;
  title?: string | null;
  alt?: string | null;
  depth?: number;
  ordered?: boolean;
  start?: number | null;
  checked?: boolean | null;
  lang?: string | null;
  meta?: string | null;
  align?: Array<"left" | "right" | "center" | null> | null;
};

export type BlogMarkdownProps = {
  content: string;
  className?: string;
};

const INLINE_IMAGE_DIMENSIONS_PATTERN = /^(\d+)\s*x\s*(\d+)$/i;

export function parseInlineImageDimensions(title?: string | null) {
  if (!title) {
    return null;
  }

  const match = title.trim().match(INLINE_IMAGE_DIMENSIONS_PATTERN);

  if (!match) {
    return null;
  }

  const width = Number(match[1]);
  const height = Number(match[2]);

  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    return null;
  }

  return { width, height };
}

function parseMarkdown(content: string) {
  return remark().use(remarkGfm).parse(content) as MarkdownNode;
}

function renderNodes(
  nodes: MarkdownNode[] = [],
  path: string[] = [],
  inListItem = false,
): ReactNode[] {
  return nodes.map((node, index) => renderNode(node, [...path, String(index)], inListItem));
}

function renderNode(node: MarkdownNode, path: string[], inListItem: boolean): ReactNode {
  const key = path.join("-");

  switch (node.type) {
    case "root":
      return <Fragment key={key}>{renderNodes(node.children, path, inListItem)}</Fragment>;

    case "text":
      return node.value ?? "";

    case "paragraph":
      return inListItem ? (
        <Fragment key={key}>{renderNodes(node.children, path, inListItem)}</Fragment>
      ) : (
        <p key={key}>{renderNodes(node.children, path, inListItem)}</p>
      );

    case "strong":
      return <strong key={key}>{renderNodes(node.children, path, inListItem)}</strong>;

    case "emphasis":
      return <em key={key}>{renderNodes(node.children, path, inListItem)}</em>;

    case "delete":
      return <del key={key}>{renderNodes(node.children, path, inListItem)}</del>;

    case "inlineCode":
      return (
        <code key={key} className="rounded bg-card px-1.5 py-0.5 font-mono text-[0.9em]">
          {node.value ?? ""}
        </code>
      );

    case "heading": {
      const depth = node.depth ?? 2;
      const Heading = depth === 1 ? "h1" : depth === 2 ? "h2" : depth === 3 ? "h3" : "h4";

      return <Heading key={key}>{renderNodes(node.children, path, inListItem)}</Heading>;
    }

    case "blockquote":
      return <blockquote key={key}>{renderNodes(node.children, path, inListItem)}</blockquote>;

    case "list": {
      if (node.ordered) {
        return (
          <ol key={key} start={node.start ?? undefined}>
            {renderNodes(node.children, path, false)}
          </ol>
        );
      }

      return <ul key={key}>{renderNodes(node.children, path, false)}</ul>;
    }

    case "listItem":
      return (
        <li key={key}>
          {node.checked !== null && node.checked !== undefined ? (
            <input
              aria-label={node.checked ? "Completed" : "Incomplete"}
              checked={node.checked}
              className="mr-2 align-text-top"
              readOnly
              type="checkbox"
            />
          ) : null}
          {renderNodes(node.children, path, true)}
        </li>
      );

    case "link":
      return (
        <a href={node.url ?? "#"} key={key}>
          {renderNodes(node.children, path, inListItem)}
        </a>
      );

    case "image": {
      const dimensions = parseInlineImageDimensions(node.title);

      if (!node.alt || node.alt.trim().length === 0) {
        throw new Error("Blog markdown images require alt text.");
      }

      if (!node.url) {
        throw new Error("Blog markdown images require a URL.");
      }

      if (!dimensions) {
        throw new Error(
          `Blog markdown images must use a WIDTHxHEIGHT title payload. Invalid image: ${node.url}`,
        );
      }

      return (
        <figure key={key}>
          <BlogPostImage
            alt={node.alt}
            height={dimensions.height}
            sizes="(min-width: 1280px) 44rem, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 2rem)"
            src={node.url}
            variant="inline"
            width={dimensions.width}
          />
        </figure>
      );
    }

    case "table":
      return (
        <div key={key} aria-label="Scrollable table" className="blog-table-wrap" role="region">
          <table>{renderNodes(node.children, path, false)}</table>
        </div>
      );

    case "tableRow":
      return <tr key={key}>{renderNodes(node.children, path, false)}</tr>;

    case "tableCell": {
      const cellIndex = Number(path[path.length - 1]);
      const align = node.align?.[cellIndex] ?? undefined;
      const sharedProps = {
        className: "align-top",
        style: align ? { textAlign: align } : undefined,
      };
      const isHeaderRow = path[path.length - 2] === "0";

      return isHeaderRow ? (
        <th key={key} scope="col" {...sharedProps}>
          {renderNodes(node.children, path, false)}
        </th>
      ) : (
        <td key={key} {...sharedProps}>
          {renderNodes(node.children, path, false)}
        </td>
      );
    }

    case "code":
      return (
        <pre key={key}>
          <code className={node.lang ? `language-${node.lang}` : undefined}>
            {node.value ?? ""}
          </code>
        </pre>
      );

    case "thematicBreak":
      return <hr key={key} />;

    case "break":
      return <br key={key} />;

    default:
      return node.children ? (
        <Fragment key={key}>{renderNodes(node.children, path, inListItem)}</Fragment>
      ) : null;
  }
}

export function BlogMarkdown({ className, content }: BlogMarkdownProps) {
  const tree = parseMarkdown(content);

  return <div className={cn("blog-prose", className)}>{renderNodes(tree.children, ["root"])}</div>;
}
