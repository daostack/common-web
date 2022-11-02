import React, { FC } from "react";
import { AutoSizer, Grid, WindowScroller } from "react-virtualized";
import { Loader } from "@/shared/components";
import { ExtendedProposal } from "../../interfaces";
import { ProposalCard } from "../ProposalCard";
import "./index.scss";

const CARD_WIDTH = 384;
const CARD_HEIGHT = 382;
const CARDS_V_GAP = 32;
const CARDS_H_GAP = 24;

interface VirtualizedProposalListProps {
  title: string;
  emptyListText: string;
  proposals: ExtendedProposal[];
  isLoading: boolean;
  onProposalView: (proposal: ExtendedProposal) => void;
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
        <div className="virtualized-invoice-list-wrapper__window-scroller-wrapper">
          <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => {
                  const columnWidthWithGap = CARD_WIDTH + CARDS_H_GAP;
                  const rawColumnCount = Math.floor(width / columnWidthWithGap);
                  const columnCount = rawColumnCount || 1;
                  const columnWidth =
                    rawColumnCount === 0 ? width : columnWidthWithGap;
                  const rowCount = Math.ceil(proposals.length / columnCount);
                  const rowHeight = CARD_HEIGHT + CARDS_V_GAP;

                  return (
                    <Grid
                      className="virtualized-invoice-list-wrapper__grid"
                      width={width}
                      height={height}
                      autoHeight
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      scrollTop={scrollTop}
                      columnCount={columnCount}
                      columnWidth={columnWidth}
                      rowCount={rowCount}
                      rowHeight={rowHeight}
                      cellRenderer={({ columnIndex, key, rowIndex, style }) => {
                        const index = rowIndex * columnCount + columnIndex;
                        const proposal = proposals[index];

                        if (!proposal) {
                          return null;
                        }

                        return (
                          <div
                            key={key}
                            style={style}
                            className="virtualized-invoice-list-wrapper__card-wrapper"
                          >
                            <ProposalCard
                              proposal={proposal.proposal}
                              common={proposal.common}
                              user={proposal.user}
                              withAdditionalData
                              onClick={() => onProposalView(proposal)}
                            />
                          </div>
                        );
                      }}
                    />
                  );
                }}
              </AutoSizer>
            )}
          </WindowScroller>
        </div>
      )}
    </section>
  );
};

export default VirtualizedProposalList;
