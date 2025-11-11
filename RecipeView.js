// RecipeView: detailed recipe page with simple/advanced mode and video thumbnail.

export function RecipeView({ recipe, onBack, onEdit, onShare, t, FLAG, getLangField, extractVideoId, DEFAULT_THUMB, onToggleFavorite, favoriteIds }) {
  const { useState, Fragment } = React;
  const h = React.createElement;

  const r = recipe;
  const [viewMode, setViewMode] = useState('advanced');

  const { value: nameVal, warning: nameWarn } = getLangField(r, 'name');
  const { value: tagsVal } = getLangField(r, 'tags');
  const baseTags = Array.isArray(r.tags) ? r.tags : [];
  const fromSet = favoriteIds && typeof favoriteIds.has === 'function' ? favoriteIds.has(r.id) : false;
  const fromTags = baseTags.some(t => (t ?? '').toLowerCase() === 'favorite');
  const isFav = fromSet || fromTags;
  const combinedTags = Array.from(new Set([...(baseTags || []), ...((tagsVal || []))]));
  const nonFavoriteTags = combinedTags.filter(tag => (tag ?? '').toString().toLowerCase() !== 'favorite');
  const detailTabLabels = (nonFavoriteTags || []).filter(Boolean);

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

  return h('section', { className: 'page page-detail pinned-controls', style: { display: 'block' }, id: 'pageDetail' },
    h('div', { className: 'detail-hero' },
      h('img', {
        src: thumbUrl,
        alt: nameVal || '',
        onError: e => { e.target.onerror = null; e.target.src = DEFAULT_THUMB; }
      }),
      h('div', { className: 'hero-bar pinned' },
  return h('section', { className: 'page page-detail', style: { display: 'block' }, id: 'pageDetail' },
    h('div', { className: 'hero-shell' },
      h('div', { className: 'detail-hero' },
        h('img', {
          src: thumbUrl,
          alt: nameVal || '',
          onError: e => { e.target.onerror = null; e.target.src = DEFAULT_THUMB; }
        })
      ),
      h('div', { className: 'hero-bar floating' },
        h('button', { className: 'icon-btn ghost', onClick: onBack, 'aria-label': t('Back') }, '←'),
        h('div', { className: 'hero-actions' },
          h('button', { className: 'icon-btn ghost', onClick: onShare }, '🔗'),
          h('button', { className: 'icon-btn ghost', onClick: () => onEdit(r) }, '✏️'),
          onToggleFavorite && h('button', { className: 'icon-btn ghost heart', onClick: () => onToggleFavorite(r.id) }, isFav ? '❤️' : '🤍')
        )
      ),
      h('div', { className: 'hero-info floating' },
        h('div', { className: 'hero-meta' },
          h('span', { className: 'meta-chip flag' }, FLAG[r.country] || '🏳️'),
          h('span', { className: 'meta-chip' }, h('span', { className: 'ic time' }), ' ', r.timeMinutes ?? '—', ' min'),
          h('span', { className: 'meta-chip health' }, h('span', { className: 'heart-icon', 'aria-hidden': 'true' }, '💚'), ' ', r.healthScore != null ? r.healthScore : '—')
        ),
        h('h2', { className: 'hero-title' },
          nameVal || t('Recipe'),
          nameWarn ? h('span', { title: 'English fallback', className: 'fallback-indicator' }, '*') : null
        ),
        h('p', { className: 'hero-sub' }, chefTipsVal || dietTipsVal || t('Dietitian Tips & Macros'))
      )
    ),
    h('div', { className: 'wrap detail-wrap' },
      h('section', { className: 'detail-card' },
        h('div', { className: 'detail-header' }, t('View Mode')),
        h('div', { className: 'segmented detail' },
          h('button', { className: 'segment-btn' + (viewMode === 'simple' ? ' active' : ''), onClick: () => setViewMode('simple') }, t('Simple')),
          h('button', { className: 'segment-btn' + (viewMode === 'advanced' ? ' active' : ''), onClick: () => setViewMode('advanced') }, t('Advanced'))
        ),
        (isFav || detailTabLabels.length > 0) && h('div', { className: 'detail-tags' },
          isFav && h('span', { className: 'tab-chip fav' }, '❤️ ', t('Favorite')),
          detailTabLabels.map((tg, i) => h('span', { key: i, className: 'tab-chip' }, tg))
        ),
        r.calories != null && h('div', { className: 'info-pills' },
          h('div', { className: 'pill' }, h('span', { className: 'ic kcal' }), r.calories, ' kcal')
        )
      ),
      viewMode === 'simple' && h('section', { className: 'detail-card' },
        h('div', { className: 'detail-header' }, t('Ingredients')),
        h('p', { className: 'detail-body-text' },
          (ingredientsVal || []).length > 0
            ? (ingredientsVal || []).map((i, idx) => h('span', { key: idx },
                i.name, (i.quantity ? ` — ${i.quantity} ${i.unit || ''}` : ''), idx < (ingredientsVal.length || 0) - 1 ? ', ' : ''))
            : '—'
        ),
        h('div', { className: 'divider soft' }),
        h('div', { className: 'detail-header' }, t('Preparation')),
        h('p', { className: 'detail-body-text' }, prepSimpleVal || '—')
      ),
      viewMode === 'advanced' && h('section', { className: 'detail-card stack', id: 'rowAdvanced' },
        h('div', { className: 'detail-header' }, t('Ingredients')),
        h('ul', { className: 'detail-list' },
          (ingredientsVal || []).length > 0
            ? ingredientsVal.map((i, idx) => h('li', { key: idx }, i.name, (i.quantity ? ` — ${i.quantity} ${i.unit || ''}` : '')))
            : h('li', null, '—')
        ),
        h('div', { className: 'detail-header' }, t('Optional / Enrichment')),
        h('ul', { className: 'detail-list' },
          (optionalVal || []).length > 0
            ? optionalVal.map((i, idx) => h('li', { key: idx }, i.name, (i.quantity ? ` — ${i.quantity} ${i.unit || ''}` : '')))
            : h('li', null, '—')
        ),
        h('div', { className: 'detail-header' }, t('Preparation — Advanced')),
        h('p', { className: 'detail-body-text' }, prepAdvVal || '—'),
        h('div', { className: 'detail-header' }, t('Chef Tips')),
        h('p', { className: 'detail-body-text' }, chefTipsVal || '—'),
        h('div', { className: 'detail-header' }, t('Dietitian Tips & Macros')),
        h('p', { className: 'detail-body-text' }, dietTipsVal || '—'),
        h('div', { className: 'macro-pill' }, macro),
        h('div', { className: 'detail-header' }, t('Videos')),
        (videosVal && videosVal.length > 0)
          ? h('div', { className: 'videos' },
              videosVal.map((v, idx) =>
                h('a', { key: idx, className: 'vid-link', href: v.url, target: '_blank', rel: 'noopener noreferrer' },
                  h('span', { className: 'dot' }), v.title || t('Video'))))
          : h('p', { className: 'detail-body-text' }, '—')
      )
    )
  );
}
