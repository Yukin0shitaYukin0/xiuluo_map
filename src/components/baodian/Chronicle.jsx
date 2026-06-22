import { useState } from 'react';
import { C, FONT_BODY, FONT_TITLE, TRANS } from './codexStyles';
import { CHRONICLE_STAGES } from '../../data/baodianData';

const S = {
  wrapper: {
    padding: '16px 0', height: '100%', overflowY: 'auto',
  },
  title: {
    fontFamily: FONT_TITLE, fontSize: '20px', color: C.gold,
    marginBottom: '4px', letterSpacing: '0.06em',
  },
  subtitle: {
    fontSize: '12px', color: C.textMuted, marginBottom: '24px',
    fontFamily: FONT_BODY,
  },
  timeline: {
    position: 'relative', paddingLeft: '32px',
  },
  line: {
    position: 'absolute', left: '14px', top: 0, bottom: 0,
    width: '1px', background: `linear-gradient(180deg, ${C.bronze}44, ${C.goldDim}44, ${C.bronze}44)`,
  },
  stageItem: {
    position: 'relative', marginBottom: '20px',
  },
  dot: (expanded) => ({
    position: 'absolute', left: '-22px', top: '5px',
    width: expanded ? '12px' : '10px', height: expanded ? '12px' : '10px',
    borderRadius: '50%',
    background: expanded ? C.gold : C.bronze,
    border: `2px solid ${expanded ? C.goldBright : C.bronzeLight}`,
    boxShadow: expanded ? `0 0 10px ${C.gold}44` : 'none',
    transition: TRANS,
  }),
  stageHeader: {
    display: 'flex', alignItems: 'center', gap: '10px',
    cursor: 'pointer', padding: '6px 0',
  },
  stageName: {
    fontFamily: FONT_TITLE, fontSize: '15px', color: C.textPrimary,
    letterSpacing: '0.05em',
  },
  stageDesc: {
    fontSize: '12px', color: C.textMuted, marginTop: '2px',
    fontFamily: FONT_BODY,
  },
  stageCount: {
    fontSize: '10px', color: C.textMuted, marginLeft: 'auto',
  },
  events: {
    padding: '6px 0 10px 0',
  },
  eventCard: {
    padding: '10px 14px', marginBottom: '8px',
    background: 'rgba(13,15,20,0.5)',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '3px',
    cursor: 'pointer',
    transition: TRANS,
  },
  eventName: {
    fontSize: '13px', color: C.textSecondary,
    fontFamily: FONT_BODY, fontWeight: 600,
    marginBottom: '3px',
  },
  eventDesc: {
    fontSize: '11px', color: C.textMuted, lineHeight: '1.6',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  emptyStage: {
    fontSize: '11px', color: C.textMuted, padding: '6px 0',
    fontStyle: 'italic',
  },
};

export default function Chronicle({ eventsByStage, onSelectEntry }) {
  const [expandedStages, setExpandedStages] = useState({});

  const toggleStage = (key) => {
    setExpandedStages((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={S.wrapper}>
      <div style={S.title}>楚枫征途</div>
      <div style={S.subtitle}>修罗成神之路，横跨八荒六合，历经九道天河</div>

      <div style={S.timeline}>
        <div style={S.line} />

        {CHRONICLE_STAGES.map((stage) => {
          const expanded = expandedStages[stage.key] !== false;
          const events = eventsByStage ? (eventsByStage[stage.key] || []) : [];

          return (
            <div key={stage.key} style={S.stageItem}>
              <div style={S.dot(expanded)} />
              <div style={S.stageHeader} onClick={() => toggleStage(stage.key)}>
                <span style={S.stageName}>{stage.name}</span>
                <span style={S.stageCount}>{events.length} 事件</span>
              </div>
              <div style={S.stageDesc}>{stage.description}</div>

              {expanded && (
                <div style={S.events}>
                  {events.length === 0 ? (
                    <div style={S.emptyStage}>此篇待修行者记述……</div>
                  ) : (
                    events.map((evt) => (
                      <div key={evt.id} style={S.eventCard}
                        onClick={() => onSelectEntry && onSelectEntry(evt.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = C.borderActive;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = C.borderSubtle;
                        }}>
                        <div style={S.eventName}>{evt.name}</div>
                        {evt.description && (
                          <div style={S.eventDesc}>{evt.description}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
