import React, { useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ModalContext } from '../../contexts/ModalContext';
import { useTranslate } from '../../hooks/useTranslate';
import { SeasonRating } from '../../models/Api';
import { getColor, textFill, formatVote, GRAY } from '../../utils/ratings';

function avg(a: number[]): number {
  return a.reduce((s, v) => s + v, 0) / a.length;
}

interface ISeasonRatingsGridProps {
  ratings: SeasonRating[];
}

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

  const { toggle } = useContext(ModalContext);
  const { t } = useTranslate();

  const rowTrackEp = `33px`;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="my-3 overflow-x-auto">
          <div
            className="grid min-w-fit gap-2 gap-x-1.5"
            style={{
              gridTemplateColumns: `39px repeat(${numCols}, minmax(40px, 50px))`,
              gridTemplateRows: `min-content ${Array(maxEpisodes)
                .fill(rowTrackEp)
                .join(' ')} ${rowTrackEp} `,
            }}
          >
            {/* Season headers — row 1, columns 2..numCols+1 */}
            {seasonNums.map((sn, i) => (
              <div
                key={sn}
                className="text-xs text-center"
                style={{
                  gridColumn: i + 2,
                  gridRow: 1,
                }}
              >
                {t('season_abbreviation')}
                {sn}
              </div>
            ))}

            {/* Episode labels — column 1, rows 2..maxEpisodes+1 */}
            {Array.from({ length: maxEpisodes }, (_, i) => (
              <div
                key={`lbl-${i}`}
                className="sticky bg-white left-0 flex items-center justify-end text-xs pr-2"
                style={{
                  zIndex: 1,
                  gridColumn: 1,
                  gridRow: i + 2,
                }}
              >
                E{i + 1}
              </div>
            ))}

            {/* Cell rows — columns 2..numCols+1, rows 2..maxEpisodes+1 */}
            {ratings.map((season, si) => {
              const sn = season.episodes[0]?.season_number ?? 0;
              return season.episodes.map((ep, rowIdx) => {
                const vote = ep.vote_average;
                const color = getColor(vote);
                const tf = textFill(color);
                return (
                  <div
                    key={`c-${sn}-${ep.episode_number}`}
                    className="flex items-center justify-center font-semibold cursor-pointer"
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
                    style={{
                      gridColumn: si + 2,
                      gridRow: rowIdx + 2,
                      backgroundColor: color,
                      borderRadius: 5,
                      color: tf,
                    }}
                  >
                    {formatVote(vote)}
                  </div>
                );
              });
            })}

            {/* AVG label — column 1, row maxEpisodes+2 */}
            <div
              className="sticky flex items-center justify-end pr-2 text-xs left-0 bg-white"
              style={{
                gridColumn: 1,
                gridRow: maxEpisodes + 2,
              }}
            >
              {t('avg')}
            </div>

            {/* AVG values — columns 2..numCols+1, row maxEpisodes+2 */}
            {seasonNums.map((sn, i) => {
              const avgVote = seasonAvgs[sn];
              const avgColor = avgVote ? getColor(avgVote) : GRAY;
              return (
                <div
                  key={`av-${sn}`}
                  className="flex flex-col items-center justify-center font-semibold text-sm"
                  style={{
                    gridColumn: i + 2,
                    gridRow: maxEpisodes + 2,
                  }}
                >
                  <span className="flex items-center flex-1">
                    {avgVote !== undefined ? avgVote.toFixed(1) : ''}
                  </span>
                  <div
                    key={`bar-${sn}`}
                    className="justify-end w-full rounded-full h-1"
                    style={{
                      backgroundColor: avgColor,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
