// RecipeEditor: create/edit form with i18n tabs; keeps an internal working copy and calls onSave(edited).

export function RecipeEditor({ recipe, isCreate, onCancel, onSave, t, LANGS, FLAG, collectCountries, onDraftChange }) {
  const { useState, useEffect } = React;
  const h = React.createElement;

  const [r, setR] = useState(() => JSON.parse(JSON.stringify(recipe)));
  const [editLangTab, setEditLangTab] = useState('en');

  useEffect(() => {
    if (onDraftChange) onDraftChange(r);
  }, [r, onDraftChange]);

  const updateField = (field, value) => setR(prev => ({ ...prev, [field]: value }));
  const updateMacro = (macroField, value) => setR(prev => ({ ...prev, macros: { ...prev.macros, [macroField]: value } }));

  // Ingredients
  const addIngredient = () => setR(prev => ({ ...prev, ingredients: [...(prev.ingredients || []), { name: '', quantity: '', unit: '' }] }));
  const updateIngredient = (index, key, value) => setR(prev => { const list = [...(prev.ingredients || [])]; list[index] = { ...list[index], [key]: value }; return { ...prev, ingredients: list }; });
  const removeIngredient = index => setR(prev => { const list = [...(prev.ingredients || [])]; list.splice(index, 1); return { ...prev, ingredients: list }; });

  // Optional
  const addOptional = () => setR(prev => ({ ...prev, optionalIngredients: [...(prev.optionalIngredients || []), { name: '', quantity: '', unit: '' }] }));
  const updateOptional = (index, key, value) => setR(prev => { const list = [...(prev.optionalIngredients || [])]; list[index] = { ...list[index], [key]: value }; return { ...prev, optionalIngredients: list }; });
  const removeOptional = index => setR(prev => { const list = [...(prev.optionalIngredients || [])]; list.splice(index, 1); return { ...prev, optionalIngredients: list }; });

  // Videos
  const addVideo = () => setR(prev => ({ ...prev, videoLinks: [...(prev.videoLinks || []), { title: '', url: '' }] }));
  const updateVideo = (index, key, value) => setR(prev => { const list = [...(prev.videoLinks || [])]; list[index] = { ...list[index], [key]: value }; return { ...prev, videoLinks: list }; });
  const removeVideo = index => setR(prev => { const list = [...(prev.videoLinks || [])]; list.splice(index, 1); return { ...prev, videoLinks: list }; });

  // i18n
  const updateLangField = (lc, field, value) => setR(prev => {
    const next = { ...prev };
    next.i18n = next.i18n || {};
    next.i18n[lc] = next.i18n[lc] || {};
    next.i18n[lc][field] = value;
    if (lc === 'en') next[field] = value;
    return next;
  });
  const updateLangTags = (lc, value) => {
    const arr = value.split(',').map(t => t.trim()).filter(Boolean);
    setR(prev => {
      const next = { ...prev };
      next.i18n = next.i18n || {};
      next.i18n[lc] = next.i18n[lc] || {};
      next.i18n[lc].tags = arr;
      if (lc === 'en') next.tags = arr;
      return next;
    });
  };

  return h('section', { className: 'page page-editor', style: { display: 'block' }, id: 'pageEditor' },
    h('header', { className: 'page-header form' },
      h('button', { className: 'page-link', onClick: onCancel }, t('Cancel')),
      h('div', { className: 'page-title-group' },
        h('h2', { className: 'page-title' }, isCreate ? t('Add Recipe') : t('Edit Recipe')),
        h('p', { className: 'page-subtitle' }, isCreate ? t('Creating') : t('Editing'))
      ),
      h('button', { className: 'page-link save', onClick: () => onSave(r) }, t('Save'))
    ),
    h('div', { className: 'wrap form-wrap' },
      h('section', { className: 'form-card' },
        h('div', { className: 'form-grid two-col' },
          h('div', { className: 'field' },
            h('label', null, t('Country')),
            h('select', { value: r.country, onChange: e => updateField('country', e.target.value) },
              collectCountries.map(cty => h('option', { key: cty, value: cty }, (FLAG[cty] || '🏳️'), ' ', cty))
            )
          ),
          h('div', { className: 'field' }, h('label', null, t('Health Score (1–10)')),
            h('input', { type: 'number', min: 1, max: 10, step: 1, value: r.healthScore, onChange: e => updateField('healthScore', parseInt(e.target.value, 10)) })),
          h('div', { className: 'field' }, h('label', null, t('Calories (kcal)')),
            h('input', { type: 'number', min: 0, step: 1, value: r.calories, onChange: e => updateField('calories', parseInt(e.target.value, 10)) })),
          h('div', { className: 'field' }, h('label', null, t('Time (minutes)')),
            h('input', { type: 'number', min: 0, step: 1, value: r.timeMinutes, onChange: e => updateField('timeMinutes', parseInt(e.target.value, 10)) })),
          h('div', { className: 'field' }, h('label', null, t('Difficulty (text)')),
            h('input', { value: r.difficulty, onChange: e => updateField('difficulty', e.target.value), placeholder: 'Easy / Medium / Hard' })),
          h('div', { className: 'field' }, h('label', null, `${t('Protein')} (g)`),
            h('input', { type: 'number', min: 0, step: 1, value: r.macros.protein, onChange: e => updateMacro('protein', parseFloat(e.target.value)) })),
          h('div', { className: 'field' }, h('label', null, `${t('Fat')} (g)`),
            h('input', { type: 'number', min: 0, step: 1, value: r.macros.fat, onChange: e => updateMacro('fat', parseFloat(e.target.value)) })),
          h('div', { className: 'field' }, h('label', null, `${t('Carbs')} (g)`),
            h('input', { type: 'number', min: 0, step: 1, value: r.macros.carbs, onChange: e => updateMacro('carbs', parseFloat(e.target.value)) }))
        )
      ),
      h('section', { className: 'form-card' },
        h('div', { className: 'lang-tabs' },
          LANGS.map(code => h('button', { key: 'tab-' + code, className: 'tab-btn' + (editLangTab === code ? ' active' : ''), onClick: () => setEditLangTab(code) },
            code === 'en' ? '🇬🇧 EN' : code === 'es' ? '🇪🇸 ES' : code === 'de' ? '🇩🇪 DE' : '🇫🇷 FR'))
        ),
        (() => {
          const lc = editLangTab;
          return h('div', { key: 'lang-' + lc, className: 'lang-panel' },
            h('div', { className: 'field' }, h('label', null, t('Name'), ' (', lc.toUpperCase(), ')'),
              h('input', { value: (r.i18n && r.i18n[lc] && r.i18n[lc].name) || '', onChange: e => updateLangField(lc, 'name', e.target.value) })),
            h('div', { className: 'field' }, h('label', null, t('Tags (comma separated)'), ' (', lc.toUpperCase(), ')'),
              h('input', { value: ((r.i18n && r.i18n[lc] && r.i18n[lc].tags) || []).join(', '), onChange: e => updateLangTags(lc, e.target.value) })),
            h('div', { className: 'field' }, h('label', null, t('Preparation (Simple)'), ' (', lc.toUpperCase(), ')'),
              h('textarea', { rows: 2, value: (r.i18n && r.i18n[lc] && r.i18n[lc].preparationSimple) || '', onChange: e => updateLangField(lc, 'preparationSimple', e.target.value) })),
            h('div', { className: 'field' }, h('label', null, t('Preparation (Advanced)'), ' (', lc.toUpperCase(), ')'),
              h('textarea', { rows: 3, value: (r.i18n && r.i18n[lc] && r.i18n[lc].preparationAdvanced) || '', onChange: e => updateLangField(lc, 'preparationAdvanced', e.target.value) })),
            h('div', { className: 'field' }, h('label', null, t('Chef Tips'), ' (', lc.toUpperCase(), ')'),
              h('textarea', { rows: 2, value: (r.i18n && r.i18n[lc] && r.i18n[lc].chefTips) || '', onChange: e => updateLangField(lc, 'chefTips', e.target.value) })),
            h('div', { className: 'field' }, h('label', null, t('Dietitian Tips'), ' (', lc.toUpperCase(), ')'),
              h('textarea', { rows: 2, value: (r.i18n && r.i18n[lc] && r.i18n[lc].dietitianTips) || '', onChange: e => updateLangField(lc, 'dietitianTips', e.target.value) }))
          );
        })()
      ),
      h('section', { className: 'form-card' },
        h('div', { className: 'form-card-title' }, t('Ingredients')),
        h('div', { className: 'table-shell' },
          h('table', { className: 'tbl', id: 'tblIngr' },
            h('thead', null, h('tr', null, h('th', null, 'Name'), h('th', null, 'Qty'), h('th', null, 'Unit'), h('th', null))),
            h('tbody', null,
              (r.ingredients || []).map((item, idx) =>
                h('tr', { key: idx }, h('td', { colSpan: 4 },
                  h('div', { className: 'rowline' },
                    h('input', { placeholder: 'name', value: item.name, onChange: e => updateIngredient(idx, 'name', e.target.value) }),
                    h('input', { placeholder: 'qty', type: 'number', step: '0.1', value: item.quantity !== undefined && item.quantity !== '' ? item.quantity : '', onChange: e => updateIngredient(idx, 'quantity', e.target.value) }),
                    h('input', { placeholder: 'unit', value: item.unit || '', onChange: e => updateIngredient(idx, 'unit', e.target.value) }),
                    h('button', { className: 'mini-btn danger', onClick: () => removeIngredient(idx) }, t('Remove'))
                  )
                )))
            )
          ),
          h('div', { className: 'inline actions' },
            h('button', { className: 'mini-btn ok', onClick: addIngredient }, '+ ', t('Add ingredient'))
          )
        )
      ),
      h('section', { className: 'form-card' },
        h('div', { className: 'form-card-title' }, t('Optional Ingredients')),
        h('div', { className: 'table-shell' },
          h('table', { className: 'tbl', id: 'tblOpt' },
            h('thead', null, h('tr', null, h('th', null, 'Name'), h('th', null, 'Qty'), h('th', null, 'Unit'), h('th', null))),
            h('tbody', null,
              (r.optionalIngredients || []).map((item, idx) =>
                h('tr', { key: idx }, h('td', { colSpan: 4 },
                  h('div', { className: 'rowline' },
                    h('input', { placeholder: 'name', value: item.name, onChange: e => updateOptional(idx, 'name', e.target.value) }),
                    h('input', { placeholder: 'qty', type: 'number', step: '0.1', value: item.quantity !== undefined && item.quantity !== '' ? item.quantity : '', onChange: e => updateOptional(idx, 'quantity', e.target.value) }),
                    h('input', { placeholder: 'unit', value: item.unit || '', onChange: e => updateOptional(idx, 'unit', e.target.value) }),
                    h('button', { className: 'mini-btn danger', onClick: () => removeOptional(idx) }, t('Remove'))
                  )
                )))
            )
          ),
          h('div', { className: 'inline actions' },
            h('button', { className: 'mini-btn ok', onClick: addOptional }, '+ ', t('Add optional'))
          )
        )
      ),
      h('section', { className: 'form-card' },
        h('div', { className: 'form-card-title' }, t('Videos')),
        h('div', { className: 'table-shell' },
          h('table', { className: 'tbl', id: 'tblVid' },
            h('thead', null, h('tr', null, h('th', null, 'Title'), h('th', null, 'URL'), h('th', null))),
            h('tbody', null,
              (r.videoLinks || []).map((item, idx) =>
                h('tr', { key: idx }, h('td', { colSpan: 3 },
                  h('div', { className: 'rowline2' },
                    h('input', { placeholder: t('Video title'), value: item.title, onChange: e => updateVideo(idx, 'title', e.target.value) }),
                    h('input', { placeholder: 'https://youtube.com/...', value: item.url, onChange: e => updateVideo(idx, 'url', e.target.value) }),
                    h('button', { className: 'mini-btn danger', onClick: () => removeVideo(idx) }, t('Remove'))
                  )
                )))
            )
          ),
          h('div', { className: 'inline actions' },
            h('button', { className: 'mini-btn ok', onClick: addVideo }, '➕ ', t('Add video'))
          )
        )
      )
    )
  );
}
