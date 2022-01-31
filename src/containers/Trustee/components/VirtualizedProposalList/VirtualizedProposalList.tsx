import React, { FC } from "react";
import { AutoSizer, Grid, WindowScroller } from "react-virtualized";
import { Loader } from "../../../../shared/components";
import { Proposal } from "../../../../shared/models";
import { ProposalCard } from "../ProposalCard";
import "./index.scss";

const CARD_WIDTH = 384;
const CARD_HEIGHT = 328;

interface VirtualizedProposalListProps {
  title: string;
  emptyListText: string;
  proposals: Proposal[];
  isLoading: boolean;
  onProposalView: (proposal: Proposal) => void;
}

const VirtualizedProposalList: FC<VirtualizedProposalListProps> = (props) => {
  const { title, emptyListText, proposals, isLoading, onProposalView } = props;

  return (
    <section className="virtualized-invoice-list-wrapper">
      <h2 className="virtualized-invoice-list-wrapper__title">{title}</h2>
      {isLoading && <Loader />}
      {proposals.length === 0 && !isLoading && (
        <span className="virtualized-invoice-list-wrapper__empty-text">
          {emptyListText}
        </span>
      )}
      {proposals.length > 0 && !isLoading && (
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <AutoSizer disableHeight>
              {({ width }) => {
                const rawColumnCount = Math.floor(width / CARD_WIDTH);
                const columnCount = rawColumnCount || 1;
                const columnWidth = rawColumnCount === 0 ? width : CARD_WIDTH;
                const rowCount = Math.ceil(proposals.length / columnCount);

                return (
                  <Grid
                    width={width}
                    height={height}
                    autoHeight
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
                    columnCount={columnCount}
                    columnWidth={columnWidth}
                    rowCount={rowCount}
                    rowHeight={CARD_HEIGHT}
                    cellRenderer={({ columnIndex, key, rowIndex, style }) => {
                      const index = rowIndex * columnCount + columnIndex;
                      const proposal = proposals[index];

                      if (!proposal) {
                        return null;
                      }

                      return (
                        <ProposalCard
                          key={key}
                          style={style}
                          proposal={proposal}
                          onClick={() => onProposalView(proposal)}
                        />
                      );
                    }}
                  />
                );
              }}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
    </section>
  );
};

export default VirtualizedProposalList;
