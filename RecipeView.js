// RecipeView: detailed recipe page with simple/advanced mode and video thumbnail.

export function RecipeView({ recipe, onBack, onEdit, onShare, t, FLAG, getLangField, extractVideoId, DEFAULT_THUMB }) {
  const { useState, Fragment } = React;
  const h = React.createElement;

  const r = recipe;
  const [viewMode, setViewMode] = useState('simple');

  const { value: nameVal, warning: nameWarn } = getLangField(r, 'name');
  const { value: tagsVal } = getLangField(r, 'tags');
  const { value: ingredientsVal } = getLangField(r, 'ingredients');
  const { value: optionalVal } = getLangField(r, 'optionalIngredients');
  const { value: prepSimpleVal } = getLangField(r, 'preparationSimple');
  const { value: prepAdvVal } = getLangField(r, 'preparationAdvanced');
  const { value: chefTipsVal } = getLangField(r, 'chefTips');
  const { value: dietTipsVal } = getLangField(r, 'dietitianTips');
  const { value: videosVal } = getLangField(r, 'videoLinks');
  const macro = r.macros ? `Protein ${r.macros.protein || 0}g · Fat ${r.macros.fat || 0}g · Carbs ${r.macros.carbs || 0}g` : '—';

  let thumbUrl = null;
  if (videosVal && Array.isArray(videosVal) && videosVal.length > 0) {
    const vidId = extractVideoId(videosVal[0].url);
    if (vidId) thumbUrl = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
  }
  if (!thumbUrl) thumbUrl = DEFAULT_THUMB;

  return h('section', { className: 'page', style: { display: 'block' }, id: 'pageDetail' },
    h('header', { className: 'fullwidth' },
      h('button', { className: 'back', onClick: onBack }, h('span', { className: 'ic back' }), ' ', t('Back')),
      h('div', { className: 'title' },
        nameVal || t('Recipe'),
        nameWarn ? h('span', { title: 'English fallback', style: { fontSize: '11px', marginLeft: '4px', opacity: 0.6 } }, '*') : null
      ),
      h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
        h('div', { className: 'flag' }, FLAG[r.country] || '🏳️'),
        h('button', { className: 'btn sm icon', onClick: onShare }, h('span', { className: 'ic share' }), t('Share')),
        h('button', { className: 'btn sm icon', onClick: () => onEdit(r) }, h('span', { className: 'ic edit' }), t('Edit'))
      )
    ),
    h('div', { className: 'thumb-full' },
      h('img', {
        src: thumbUrl, alt: nameVal || '',
        onError: e => { e.target.onerror = null; e.target.src = DEFAULT_THUMB; }
      })
    ),
    h('div', { className: 'wrap fullwidth' },
      h('div', { className: 'row' },
        h('h5', null, t('View Mode')),
        h('div', { className: 'block2' },
          h('button', { className: 'btn sm', onClick: () => setViewMode(viewMode === 'simple' ? 'advanced' : 'simple') },
            viewMode === 'simple' ? t('Switch to Advanced') : t('Switch to Simple'))
        )
      ),
      h('div', { className: 'row' },
        h('h5', null, h('span', { className: 'ic tags' }), ' ', t('Tags')),
        h('div', { className: 'block2', id: 'dTags' },
          (tagsVal || []).map((tg, i) => h('span', { key: i, className: 'tag', style: { marginRight: '6px' } }, tg)),
          (videosVal && videosVal.length > 0) ? h('span', { className: 'tag tag-video', title: t('Video available') }, t('Video')) : null
        )
      ),
      h('div', { className: 'row' },
        h('h5', null, h('span', { className: 'ic info2' }), ' ', t('Info')),
        h('div', { className: 'block2 kv' },
          h('div', { className: 'pill health' }, h('span', { className: 'ic star' }), (r.healthScore ?? '-') + '/10'),
          h('div', { className: 'pill' }, h('span', { className: 'ic kcal' }), r.calories ?? '—', ' kcal'),
          h('div', { className: 'pill' }, h('span', { className: 'ic time' }), r.timeMinutes ?? '—', ' min'),
          h('div', { className: 'pill' }, h('span', { className: 'ic country' }), r.country || '')
        )
      ),
      viewMode === 'simple' && h(Fragment, null,
        h('div', { className: 'row' },
          h('h5', null, h('span', { className: 'ic ingredients' }), ' ', t('Ingredients')),
          h('div', { className: 'block2', id: 'dIngr' },
            (ingredientsVal || []).length > 0
              ? (ingredientsVal || []).map((i, idx) => h('span', { key: idx },
                  i.name, (i.quantity ? ` — ${i.quantity} ${i.unit || ''}` : ''), idx < (ingredientsVal.length || 0) - 1 ? ', ' : ''))
              : '—'
          )
        ),
        h('div', { className: 'row' },
          h('h5', null, h('span', { className: 'ic prep' }), ' ', t('Preparation')),
          h('div', { className: 'block2', id: 'dPrep' }, prepSimpleVal || '—')
        )
      ),
      viewMode === 'advanced' && h('div', { id: 'rowAdvanced' },
        h('div', { className: 'row' },
          h('h5', null, h('span', { className: 'ic ingredients' }), ' Ingredients (with quantities)'),
          h('div', { className: 'block2' },
            (ingredientsVal || []).length > 0
              ? h('ul', { style: { margin: 0, paddingLeft: '18px' } },
                  ingredientsVal.map((i, idx) => h('li', { key: idx },
                    i.name, (i.quantity ? ` — ${i.quantity} ${i.unit || ''}` : '')
                  )))
              : '—'
          )
        ),
        h('div', { className: 'row' },
          h('h5', null, h('span', { className: 'ic optional' }), ' ', t('Optional / Enrichment')),
          h('div', { className: 'block2' },
            (optionalVal || []).length > 0
              ? h('ul', { style: { margin: 0, paddingLeft: '18px' } },
                  optionalVal.map((i, idx) => h('li', { key: idx },
                    i.name, (i.quantity ? ` — ${i.quantity} ${i.unit || ''}` : '')
                  )))
              : '—'
          )
        ),
        h('div', { className: 'row' },
          h('h5', null, h('span', { className: 'ic advprep' }), ' ', t('Preparation — Advanced')),
          h('div', { className: 'block2' }, prepAdvVal || '—')
        ),
        h('div', { className: 'row' },
          h('h5', null, h('span', { className: 'ic chef' }), ' ', t('Chef Tips')),
          h('div', { className: 'block2' }, chefTipsVal || '—')
        ),
        h('div', { className: 'row' },
          h('h5', null, h('span', { className: 'ic diet' }), ' ', t('Dietitian Tips & Macros')),
          h('div', { className: 'block2' }, dietTipsVal || '—', h('div', { className: 'divider' }), macro)
        ),
        h('div', { className: 'row' },
          h('h5', null, h('span', { className: 'ic videos2' }), ' ', t('Videos')),
          h('div', { className: 'block2' },
            (videosVal && videosVal.length > 0)
              ? h('div', { className: 'videos' },
                  videosVal.map((v, idx) =>
                    h('a', { key: idx, className: 'vid-link', href: v.url, target: '_blank', rel: 'noopener noreferrer' },
                      h('span', { className: 'dot' }), v.title || t('Video'))))
              : '—'
          )
        )
      )
    )
  );
}
