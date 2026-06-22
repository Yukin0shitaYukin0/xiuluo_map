import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { C, FONT, TRANS } from './baodianStyles';

const S = {
  wrapper: {
    position: 'relative', zIndex: 2,
    padding: '14px 0 12px 0',
  },
  inputRow: {
    display: 'flex', alignItems: 'center',
    background: 'rgba(10,18,32,0.75)',
    border: `1px solid ${C.borderSubtle}`,
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
    transition: TRANS,
    height: '44px',
    padding: '0 14px',
    gap: '10px',
  },
  input: {
    flex: 1, border: 'none', outline: 'none',
    background: 'transparent',
    color: C.textPrimary, fontSize: '14px',
    fontFamily: FONT,
  },
  icon: {
    color: C.textMuted, fontSize: '15px', lineHeight: 1,
    userSelect: 'none',
  },
  clearBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: C.textMuted, fontSize: '16px', padding: 0,
    lineHeight: 1, transition: TRANS,
  },
  results: {
    position: 'absolute', top: '52px', left: 0, right: 0,
    background: 'rgba(10,18,32,0.96)',
    border: `1px solid ${C.borderActive}`,
    borderRadius: '8px',
    backdropFilter: 'blur(16px)',
    maxHeight: '400px', overflowY: 'auto',
    zIndex: 20,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(61,214,200,0.08)',
  },
  resultItem: {
    padding: '10px 16px', cursor: 'pointer',
    borderBottom: `1px solid ${C.borderSubtle}`,
    transition: 'background 0.15s',
  },
  resultName: {
    fontSize: '14px', color: C.textPrimary, fontWeight: 600,
  },
  resultCat: {
    display: 'inline-block', fontSize: '10px', padding: '1px 6px',
    background: 'rgba(74,127,196,0.15)', borderRadius: '2px',
    color: C.accent, marginLeft: '8px',
  },
  resultDesc: {
    fontSize: '12px', color: C.textMuted, marginTop: '3px',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  noResults: {
    padding: '24px 16px', textAlign: 'center',
    color: C.textMuted, fontSize: '13px',
  },
};

export default function SearchBar({ entries, onSelectEntry }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const entryList = useMemo(() => Object.entries(entries || {}).map(([id, e]) => ({ id, ...e })), [entries]);

  const results = useMemo(() => {
    if (!query || query.length < 1) return [];
    const q = query.toLowerCase();
    const matched = [];
    for (const entry of entryList) {
      const nameMatch = (entry.name || '').toLowerCase().includes(q);
      const descMatch = (entry.description || '').toLowerCase().includes(q);
      const tagMatch = (entry.tags || []).some((t) => t.toLowerCase().includes(q));
      if (nameMatch || descMatch || tagMatch) {
        let score = 0;
        if (nameMatch) score += (entry.name || '').toLowerCase() === q ? 100 : (entry.name || '').toLowerCase().startsWith(q) ? 50 : 20;
        if (descMatch) score += 5;
        if (tagMatch) score += 10;
        matched.push({ ...entry, _score: score });
      }
    }
    matched.sort((a, b) => b._score - a._score);
    return matched.slice(0, 25);
  }, [query, entryList]);

  // 点击外部关闭
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setFocusIdx(-1);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setFocusIdx(-1);
  }, []);

  const handleFocus = useCallback(() => {
    if (query && results.length > 0) setIsOpen(true);
  }, [query, results.length]);

  const handleSelect = useCallback((entryId) => {
    setIsOpen(false);
    setFocusIdx(-1);
    setQuery('');
    if (onSelectEntry) onSelectEntry(entryId);
  }, [onSelectEntry]);

  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    setFocusIdx(-1);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setQuery('');
      setIsOpen(false);
      setFocusIdx(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setFocusIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIdx((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && focusIdx >= 0 && results[focusIdx]) {
      handleSelect(results[focusIdx].id);
    }
  }, [results, focusIdx, handleSelect]);

  return (
    <div ref={wrapperRef} style={S.wrapper}>
      <div style={{
        ...S.inputRow,
        borderColor: isOpen ? C.borderActive : C.borderSubtle,
        boxShadow: isOpen ? '0 0 14px rgba(61,214,200,0.1)' : 'none',
      }}>
        <span style={S.icon}>&#x1F50D;</span>
        <input ref={inputRef}
          style={S.input}
          placeholder="搜索人物、势力、功法、神兵、秘境……"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button style={S.clearBtn}
            onClick={handleClear}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.textSecondary; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}>
            ✕
          </button>
        )}
      </div>

      {isOpen && query && (
        <div style={S.results}>
          {results.length === 0 ? (
            <div style={S.noResults}>未找到相关词条</div>
          ) : (
            results.map((entry, i) => (
              <div key={entry.id} style={{
                ...S.resultItem,
                background: i === focusIdx ? 'rgba(74,127,196,0.1)' : 'transparent',
              }}
              onClick={() => handleSelect(entry.id)}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(74,127,196,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = i === focusIdx ? 'rgba(74,127,196,0.1)' : 'transparent'; }}>
                <span style={S.resultName}>{entry.name}</span>
                <span style={S.resultCat}>{entry.subcategory || entry.category}</span>
                {(entry.description) && (
                  <div style={S.resultDesc}>{entry.description.slice(0, 80)}</div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
