import { useState } from 'react';
import { C, FONT_BODY, FONT_TITLE, TRANS, textGradient } from './codexStyles';

const BRANCH_COLORS = {
  '武技':    '#b8a080',
  '禁忌武技':'#a04040',
  '秘法·神技':'#c4a86a',
  '仙法':    '#5a8a6a',
};

const S = {
  wrapper: {
    padding: '16px 0', height: '100%', overflowY: 'auto',
  },
  title: {
    fontFamily: FONT_TITLE, fontSize: '20px', color: C.gold,
    marginBottom: '20px', letterSpacing: '0.06em',
  },
  branch: {
    marginBottom: '16px',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '6px', overflow: 'hidden',
  },
  branchHeader: (branch, expanded) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 16px', cursor: 'pointer',
    background: expanded ? 'rgba(196,168,106,0.04)' : 'transparent',
    borderBottom: expanded ? `1px solid ${C.borderSubtle}` : 'none',
    transition: TRANS,
    fontFamily: FONT_BODY, fontSize: '14px',
    color: expanded ? C.gold : C.textSecondary,
  }),
  branchIcon: { fontSize: '16px', width: '24px', textAlign: 'center' },
  branchArrow: (expanded) => ({
    fontSize: '9px', color: C.textMuted, transition: TRANS,
    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
    marginLeft: 'auto',
  }),
  tierWrap: {
    padding: '8px 16px 12px',
  },
  tierLabel: {
    fontFamily: FONT_BODY, fontSize: '12px', color: C.textMuted,
    marginBottom: '6px', marginTop: '8px',
    letterSpacing: '0.05em',
  },
  leaf: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '4px 12px', margin: '3px 4px',
    background: 'rgba(196,168,106,0.05)',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '3px', cursor: 'pointer',
    fontSize: '12px', color: C.textSecondary,
    fontFamily: FONT_BODY, transition: TRANS,
  },
  leafDot: (color) => ({
    width: '5px', height: '5px', borderRadius: '50%', background: color,
    opacity: 0.7,
  }),
};

export default function SkillTree({ skillTreeData, onSelectSkill }) {
  const [expandedBranches, setExpandedBranches] = useState({});

  const toggleBranch = (key) => {
    setExpandedBranches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const branches = Object.entries(skillTreeData || {});

  if (branches.length === 0) {
    return (
      <div style={S.wrapper}>
        <div style={S.title}>功法神树</div>
        <div style={{ color: C.textMuted, fontSize: '13px', padding: '40px 0', textAlign: 'center' }}>
          诸法未录，待修行者补全……
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrapper}>
      <div style={S.title}>功法神树</div>

      {branches.map(([branchKey, branch]) => {
        const expanded = expandedBranches[branchKey] !== false; // 默认展开
        const color = BRANCH_COLORS[branchKey] || C.bronze;
        const tiers = Object.entries(branch.children);

        return (
          <div key={branchKey} style={S.branch}>
            <div style={S.branchHeader(branchKey, expanded)}
              onClick={() => toggleBranch(branchKey)}
              onMouseEnter={(e) => { if (!expanded) e.currentTarget.style.background = 'rgba(196,168,106,0.03)'; }}
              onMouseLeave={(e) => { if (!expanded) e.currentTarget.style.background = 'transparent'; }}>
              <span style={S.branchIcon}>{branch.icon}</span>
              <span>{branch.label}</span>
              <span style={S.branchArrow(expanded)}>▶</span>
            </div>

            {expanded && (
              <div style={S.tierWrap}>
                {tiers.length === 0 && (
                  <div style={{ fontSize: '12px', color: C.textMuted, padding: '8px 0' }}>暂无功法录入</div>
                )}
                {tiers.map(([tierName, skills]) => (
                  <div key={tierName}>
                    <div style={S.tierLabel}>{tierName}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {(skills || []).map((skill) => (
                        <div key={skill.id} style={S.leaf}
                          onClick={() => onSelectSkill && onSelectSkill(skill.id)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = C.borderActive;
                            e.currentTarget.style.color = C.textPrimary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = C.borderSubtle;
                            e.currentTarget.style.color = C.textSecondary;
                          }}>
                          <span style={S.leafDot(color)} />
                          {skill.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
