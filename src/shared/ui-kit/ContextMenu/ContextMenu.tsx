import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  useFloating,
  autoUpdate,
  flip,
  offset,
  shift,
  useRole,
  useDismiss,
  useInteractions,
  useListNavigation,
  useTypeahead,
  FloatingPortal,
  FloatingFocusManager,
  FloatingOverlay,
} from "@floating-ui/react";
import { ContextMenuItem as Item } from "@/shared/interfaces";
import { ContextMenuItem } from "./components";
import styles from "./ContextMenu.module.scss";

export interface ContextMenuRef {
  open: (x: number, y: number) => void;
}

interface ContextMenuProps {
  menuItems: Item[];
  onOpenChange?: (open: boolean) => void;
}

export const ContextMenu = forwardRef<ContextMenuRef, ContextMenuProps>(
  (props, forwardedRef) => {
    const { menuItems, onOpenChange } = props;
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const listItemsRef = useRef<(HTMLElement | null)[]>([]);
    const listContentRef = useRef(menuItems.map((item) => item.text));

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);

      if (onOpenChange) {
        onOpenChange(open);
      }
    };

    const { x, y, refs, strategy, context } = useFloating({
      open: isOpen,
      onOpenChange: handleOpenChange,
      middleware: [
        offset({ mainAxis: 5, alignmentAxis: 4 }),
        flip({
          fallbackPlacements: ["left-start"],
        }),
        shift({ padding: 10 }),
      ],
      placement: "right-start",
      strategy: "fixed",
      whileElementsMounted: autoUpdate,
    });

    const role = useRole(context, { role: "menu" });
    const dismiss = useDismiss(context);
    const listNavigation = useListNavigation(context, {
      listRef: listItemsRef,
      onNavigate: setActiveIndex,
      activeIndex,
    });
    const typeahead = useTypeahead(context, {
      enabled: isOpen,
      listRef: listContentRef,
      onMatch: setActiveIndex,
      activeIndex,
    });

    const { getFloatingProps, getItemProps } = useInteractions([
      role,
      dismiss,
      listNavigation,
      typeahead,
    ]);

    const handleItemClick = () => {
      handleOpenChange(false);
    };

    useImperativeHandle(
      forwardedRef,
      () => ({
        open: (x, y) => {
          refs.setPositionReference({
            getBoundingClientRect: () => ({
              width: 0,
              height: 0,
              x,
              y,
              top: y,
              right: x,
              bottom: y,
              left: x,
            }),
          });

          handleOpenChange(true);
        },
      }),
      [refs],
    );

    return (
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay className={styles.overlay} lockScroll>
            <FloatingFocusManager
              context={context}
              initialFocus={refs.floating}
            >
              <div
                ref={refs.setFloating}
                style={{
                  position: strategy,
                  left: x ?? 0,
                  top: y ?? 0,
                }}
                className={styles.list}
                {...getFloatingProps()}
              >
                {menuItems.map((item, index) => (
                  <ContextMenuItem
                    key={item.id}
                    item={item}
                    {...getItemProps({
                      tabIndex: activeIndex === index ? 0 : -1,
                      ref: (node: HTMLElement) => {
                        listItemsRef.current[index] = node;
                      },
                      onClick: handleItemClick,
                      onMouseUp: handleItemClick,
                    })}
                  />
                ))}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    );
  },
);
