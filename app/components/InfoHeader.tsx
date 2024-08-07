import { inferType } from "@jsonhero/json-infer-types";
import { JSONHeroPath } from "@jsonhero/path";
import { useCallback, useMemo, useState } from "react";
import { useJson } from "~/hooks/useJson";
import {
  useJsonColumnViewAPI,
  useJsonColumnViewState,
} from "~/hooks/useJsonColumnView";
import { concatenated, getHierarchicalTypes } from "~/utilities/dataType";
import { formatRawValue } from "~/utilities/formatter";
import { isNullable } from "~/utilities/nullable";
import { CopyTextButton } from "./CopyTextButton";
import { Body } from "./Primitives/Body";
import { LargeMono } from "./Primitives/LargeMono";
import { Title } from "./Primitives/Title";
import { ValueIcon, ValueIconSize } from "./ValueIcon";
import { PencilAltIcon } from "@heroicons/react/outline";

export type InfoHeaderProps = {
  relatedPaths: string[];
};

export function InfoHeader({ relatedPaths }: InfoHeaderProps) {
  const { selectedNodeId, highlightedNodeId, selectedNodes } =
    useJsonColumnViewState();
  const { goToNodeId } = useJsonColumnViewAPI();

  if (!selectedNodeId || !highlightedNodeId || selectedNodes.length === 0) {
    return <EmptyState />;
  }

  const selectedNode = selectedNodes[selectedNodes.length - 1];

  const [json, setJson] = useJson();

  const selectedHeroPath = new JSONHeroPath(selectedNodeId);
  const selectedJson = selectedHeroPath.first(json);
  const selectedInfo = inferType(selectedJson);
  const formattedSelectedInfo = formatRawValue(selectedInfo);
  const selectedName = selectedNode.longTitle ?? selectedNode.title;

  const isSelectedLeafNode =
    selectedInfo.name !== "object" && selectedInfo.name !== "array";

  const canBeNull = useMemo(() => {
    return isNullable(relatedPaths, json);
  }, [relatedPaths, json]);

  const [hovering, setHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  console.warn(selectedInfo);

  const newPath = formattedSelectedInfo.replace(/^#/, "$").replace(/\//g, ".");

  const handleValueChange = (newValue: string) => {
    // Update the corresponding part of the json object
    selectedHeroPath.set(json, newValue);

    setJson(json);
  };

  const handleClick = useCallback(() => {
    goToNodeId(newPath, "pathBar");
  }, [newPath, goToNodeId]);

  // Add a new state variable for the textarea value
  const [textareaValue, setTextareaValue] = useState('');

  // Update the textarea value in the local state on every change
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  // Update the global state when the user presses Enter
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleValueChange(textareaValue);
      setIsEditing(false);
    }
  };

  // Set the textarea value when the user starts editing
  const startEditing = () => {
    setTextareaValue(formatRawValue(selectedInfo));
    setIsEditing(true);
  };

  return (
    <div className="mb-4 pb-4">
      <div className="flex items-center">
        <Title className="flex-1 mr-2 overflow-hidden overflow-ellipsis break-words text-slate-700 transition dark:text-slate-200">
          {selectedName ?? "nothing"}
        </Title>
        <div>
          <ValueIcon
            monochrome
            type={selectedInfo}
            size={ValueIconSize.Medium}
          />
        </div>
      </div>
      <div
        className="relative w-full h-full"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {isSelectedLeafNode && (
          isEditing ? (
            <input
            className={`z-10 py-1 mb-1 text-slate-800 overflow-ellipsis break-words transition rounded-sm dark:text-slate-300 ${hovering ? "bg-slate-100 dark:bg-slate-700" : "bg-transparent"
          }`}
              value={textareaValue}
              onChange={handleTextareaChange}
              onKeyDown={handleTextareaKeyDown}
            />
          ) : (
            <div className="flex items-center">
              <LargeMono
                className={`z-10 py-1 mb-1 text-slate-800 overflow-ellipsis break-words transition rounded-sm dark:text-slate-300 ${hovering ? "bg-slate-100 dark:bg-slate-700" : "bg-transparent"
                  }`}
              >
                {selectedNode.name === "$ref" && checkPathExists(json, newPath) ? (
                  <button onClick={handleClick}>
                    {formatRawValue(selectedInfo)}
                  </button>
                ) : (
                  formatRawValue(selectedInfo)
                )}
              </LargeMono>


            </div>
          )
        )}


        <div
          className={`absolute top-1 right-0 flex justify-end h-full w-fit transition ${hovering ? "opacity-100" : "opacity-0"
            }`}
        >
          <button className="flex ml-auto justify-center items-center w-[26px] h-[26px] hover:bg-slate-300 dark:text-slate-400 dark:hover:bg-white dark:hover:bg-opacity-[10%]"
            onClick={() => startEditing()}>
            <PencilAltIcon className='h-5' />
          </button>
          <CopyTextButton
            className="bg-slate-200 hover:bg-slate-300 h-fit mr-1 px-2 py-0.5 rounded-sm transition hover:cursor-pointer dark:text-white dark:bg-slate-600 dark:hover:bg-slate-500"
            value={formatRawValue(selectedInfo)}
          ></CopyTextButton>

        </div>
      </div>
      <div className="flex text-gray-400">
        <Body className="flex-1">
          {concatenated(getHierarchicalTypes(selectedInfo))}
        </Body>
        {canBeNull && <Body>Can be null</Body>}
      </div>
    </div>
  );
}

function checkPathExists(json: unknown, newPath: string) {
  const heroPath = new JSONHeroPath(newPath);
  const node = heroPath.first(json);
  return Boolean(node);
}

function EmptyState() {
  return (
    <div className="mb-4 pb-4 border-b border-slate-300">
      <div className="flex items-center">
        <Title className="flex-1 mr-2 text-slate-800 transition dark:text-slate-300">
          Nothing selected
        </Title>
      </div>
      <div>
        <div>
          <Title className="text-slate-800 mb-1 overflow-ellipsis break-words dark:text-slate-300">
            null
          </Title>
        </div>
      </div>
    </div>
  );
}
