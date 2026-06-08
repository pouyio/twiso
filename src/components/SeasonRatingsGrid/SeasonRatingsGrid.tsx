import React, { useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ModalContext } from '../../contexts/ModalContext';
import { useTranslate } from '../../hooks/useTranslate';
import { SeasonRating } from '../../models/Api';

interface ISeasonRatingsGridProps {
  ratings: SeasonRating[];
}

const LEGEND = [
  { color: '#1DA1F2', min: 9.5 },
  { color: '#186A3B', min: 9.0 },
  { color: '#28B463', min: 8.0 },
  { color: '#F4D03F', min: 7.0 },
  { color: '#F39C12', min: 6.0 },
  { color: '#E74C3C', min: 5.0 },
  { color: '#633974', min: 0 },
];

const DARK_COLORS = new Set(['#1DA1F2', '#186A3B', '#633974']);
const GRAY = 'rgb(189, 189, 189)';

function getColor(vote?: number): string {
  if (vote === undefined) return GRAY;
  for (const item of LEGEND) {
    if (vote >= item.min) return item.color;
  }
  return LEGEND[LEGEND.length - 1].color;
}

function textFill(color: string): string {
  return DARK_COLORS.has(color) ? '#ffffff' : '#2a2a2a';
}

function formatVote(vote?: number): string {
  if (vote === undefined) return '?';
  return vote.toFixed(1);
}

function avg(a: number[]): number {
  return a.reduce((s, v) => s + v, 0) / a.length;
}

const TRANSFORM_X = 30;
const TRANSFORM_Y = 20;
const CELL_W_MIN = 40;
const CELL_W_MAX = 50;
const CELL_H_MAX = 36;
const GAP_X = 7;
const GAP_Y = 9;
const ROW_OFFSET_Y = 9;
const TICK_SIZE = 13;

export const SeasonRatingsGrid: React.FC<ISeasonRatingsGridProps> = ({
  ratings,
}) => {
  if (ratings.length === 0) return null;

  const { seasonNums, maxEpisodes, seasonAvgs } = useMemo(() => {
    const sn = ratings.map((s) => s.episodes[0]?.season_number ?? 0);
    const maxEp = Math.max(...ratings.map((s) => s.episodes.length), 0);
    const sVotes: Record<number, number[]> = {};

    for (const s of ratings) {
      for (const ep of s.episodes) {
        const snNum = ep.season_number ?? 0;
        if (ep.vote_average !== undefined) {
          if (!sVotes[snNum]) sVotes[snNum] = [];
          sVotes[snNum].push(ep.vote_average);
        }
      }
    }

    const sa: Record<number, number> = {};
    for (const s of sn) {
      if (sVotes[s]?.length) {
        sa[s] = Math.round(avg(sVotes[s]) * 10) / 10;
      }
    }

    return { seasonNums: sn, maxEpisodes: maxEp, seasonAvgs: sa };
  }, [ratings]);

  const numCols = seasonNums.length;
  const CELL_W = Math.min(
    CELL_W_MAX,
    Math.max(CELL_W_MIN, Math.floor((280 - (numCols - 1) * GAP_X) / numCols))
  );
  const CELL_H = Math.round((CELL_W * CELL_H_MAX) / CELL_W_MAX);
  const STEP_X = CELL_W + GAP_X;
  const STEP_Y = CELL_H + GAP_Y;
  const OFFSET_X = 4;
  const gridWidth = numCols * CELL_W + (numCols - 1) * GAP_X;

  const lastRowBottom =
    ROW_OFFSET_Y + Math.max(0, maxEpisodes - 1) * STEP_Y + CELL_H;
  const bottomY = lastRowBottom + TRANSFORM_Y + 30;
  const barBottomY = bottomY + 20;
  const barHeight = 5;
  const barTopY = barBottomY - barHeight;
  const svgHeight = barBottomY + 10;

  const { toggle } = useContext(ModalContext);
  const { t } = useTranslate();

  const colCenter = (i: number) => OFFSET_X + i * STEP_X + CELL_W / 2;
  const colLeft = (i: number) => OFFSET_X + i * STEP_X;
  const rowTop = (i: number) => ROW_OFFSET_Y + i * STEP_Y;
  const cellFontSize = Math.round(CELL_W * 0.38);
  const halfW = CELL_W / 2;
  const halfH = CELL_H / 2;

  const labelColWidth = TRANSFORM_X + OFFSET_X + 5;
  const fontFamily = 'var(--default-font-family), sans-serif';
  const gridSvgWidth = OFFSET_X + gridWidth + 10;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      style={{ overflow: 'hidden' }}
    >
      <motion.div
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="my-3 min-w-0 w-full flex">
          <div
            className="bg-white"
            style={{ position: 'sticky', left: 0, zIndex: 1, flexShrink: 0 }}
          >
            <svg
              viewBox={`0 0 ${labelColWidth} ${svgHeight}`}
              style={{
                width: labelColWidth,
                height: 'auto',
                fontFamily,
              }}
            >
              <g
                fill="none"
                transform={`translate(${TRANSFORM_X}, ${TRANSFORM_Y})`}
                textAnchor="end"
                style={{ fontSize: TICK_SIZE }}
              >
                {Array.from({ length: maxEpisodes }, (_, i) => (
                  <g
                    key={i}
                    className="tick"
                    opacity={1}
                    transform={`translate(0, ${
                      ROW_OFFSET_Y + i * STEP_Y + halfH
                    })`}
                  >
                    <text fill="currentColor" x={-3} dy="0.32em">
                      E{i + 1}
                    </text>
                  </g>
                ))}
              </g>
              <text
                x={TRANSFORM_X + 1}
                y={bottomY}
                textAnchor="end"
                dominantBaseline="auto"
                fill="currentColor"
                style={{
                  fontSize: 13,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {t('avg')}
              </text>
            </svg>
          </div>
          <div className="overflow-x-auto min-w-0">
            <svg
              viewBox={`0 0 ${gridSvgWidth} ${svgHeight}`}
              style={{
                width: gridSvgWidth,
                height: 'auto',
                fontFamily,
              }}
            >
              <g
                fill="none"
                transform={`translate(0, ${TRANSFORM_Y})`}
                textAnchor="middle"
                style={{ fontSize: TICK_SIZE }}
              >
                {seasonNums.map((sn, i) => (
                  <g
                    key={sn}
                    className="tick"
                    opacity={1}
                    transform={`translate(${colCenter(i)}, 0)`}
                  >
                    <text fill="currentColor" y={-3}>
                      {t('season_abbreviation')}
                      {sn}
                    </text>
                  </g>
                ))}
              </g>
              {ratings.map((season, si) => {
                const sn = season.episodes[0]?.season_number ?? 0;
                return season.episodes.map((ep, rowIdx) => {
                  const vote = ep.vote_average;
                  const color = getColor(vote);
                  const x = colLeft(si);
                  const y = rowTop(rowIdx);
                  return (
                    <rect
                      key={`r-${sn}-${ep.episode_number}`}
                      x={x}
                      y={y}
                      rx={5}
                      ry={5}
                      width={CELL_W}
                      height={CELL_H}
                      transform={`translate(0, ${TRANSFORM_Y})`}
                      style={{
                        fill: color,
                        strokeWidth: 4,
                        stroke: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() =>
                        toggle({
                          custom: (
                            <div className="flex flex-col gap-2">
                              <p className="text-2xl">
                                {ep.name || t('episode_num', ep.episode_number)}
                              </p>
                              <p className="text-gray-600">
                                {t('season_abbreviation')}
                                {ep.season_number ?? sn} &middot; E
                                {ep.episode_number}
                              </p>
                              {ep.vote_average !== undefined && (
                                <div className="flex items-center gap-2 mt-1">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: color }}
                                  />
                                  <span className="text-lg">
                                    {formatVote(ep.vote_average)}
                                  </span>
                                  {ep.num_votes !== undefined && (
                                    <span className="text-gray-500 text-sm">
                                      &middot; {ep.num_votes.toLocaleString()}{' '}
                                      {t('votes')}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ),
                        })
                      }
                    />
                  );
                });
              })}
              <g>
                {ratings.map((season, si) => {
                  const sn = season.episodes[0]?.season_number ?? 0;
                  return season.episodes.map((ep, rowIdx) => {
                    const vote = ep.vote_average;
                    const color = getColor(vote);
                    const x = colLeft(si);
                    const y = rowTop(rowIdx);
                    return (
                      <text
                        key={`t-${sn}-${ep.episode_number}`}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`translate(0, ${TRANSFORM_Y})`}
                        dy={halfH}
                        dx={halfW}
                        fill={textFill(color)}
                        pointerEvents="none"
                        style={{
                          fontSize: `${cellFontSize}px`,
                          fontWeight: 600,
                        }}
                      >
                        {formatVote(vote)}
                      </text>
                    );
                  });
                })}
              </g>
              <g>
                {seasonNums.map((sn, i) => {
                  const avgVote = seasonAvgs[sn];
                  return (
                    <text
                      key={`av-${sn}`}
                      x={colCenter(i)}
                      y={bottomY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="currentColor"
                      pointerEvents="none"
                      style={{ fontSize: `${cellFontSize}px`, fontWeight: 600 }}
                    >
                      {avgVote !== undefined ? avgVote.toFixed(1) : ''}
                    </text>
                  );
                })}
              </g>
              <g>
                {seasonNums.map((sn, i) => {
                  const avgVote = seasonAvgs[sn];
                  const avgColor = avgVote ? getColor(avgVote) : GRAY;
                  const left = colLeft(i);
                  return (
                    <rect
                      key={`ab-${sn}`}
                      x={left}
                      y={barTopY}
                      width={CELL_W}
                      height={barHeight}
                      rx={barHeight / 2}
                      ry={barHeight / 2}
                      fill={avgColor}
                    />
                  );
                })}
              </g>
            </svg>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
