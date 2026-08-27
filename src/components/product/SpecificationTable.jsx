import React from 'react';

export default function SpecificationTable({ specifications = [] }) {
  if (!specifications || specifications.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {specifications.map((group, gIdx) => (
        <div
          key={gIdx}
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}
        >
          <div style={{
            padding: '10px 16px',
            backgroundColor: '#F8FAFC',
            fontWeight: '700',
            fontSize: '14px',
            color: 'var(--text-primary)',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            {group.group}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <tbody>
              {group.items.map((item, iIdx) => (
                <tr
                  key={iIdx}
                  style={{
                    borderBottom: iIdx === group.items.length - 1 ? 'none' : '1px solid var(--border-divider)',
                    backgroundColor: iIdx % 2 === 0 ? '#ffffff' : '#FAFAFA'
                  }}
                >
                  <td style={{
                    width: '35%',
                    padding: '10px 16px',
                    color: 'var(--text-secondary)',
                    fontWeight: '500',
                    verticalAlign: 'top'
                  }}>
                    {item.key}
                  </td>
                  <td style={{
                    padding: '10px 16px',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    lineHeight: '1.4'
                  }}>
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
