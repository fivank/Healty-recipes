// RecipeList: header/menu, search, actions, active filter chips, and the recipe grid.

export function RecipeList(props) {
  const {
    recipes, visibleRecipes, selectedIds, selecting, searchQuery,
    setSearchQuery, openAdvanced, enterSelection, exitSelection,
    selectAllVisible, openShare, bulkDelete, FLAG, t, menuOpen, setMenuOpen,
    setLang, FLAG_EMOJI, deleteRecipe, openDetail, toggleSelected,
    lang, langMenuOpen, setLangMenuOpen,
    DEFAULT_THUMB, getLangField, extractVideoId, activeFilterChips,
    onImport, onExport, openEditor, resetRecipes,
    // ADD:
    favoritesOnly, toggleFavorites, favoriteIds, cloudSave, cloudImport
  } = props;

  const h = React.createElement;
  const Fragment = React.Fragment;

  const selectToggle = h('button', {
    className: 'btn soft icon select-toggle',
    onClick: () => (selecting ? exitSelection() : enterSelection()),
    'aria-pressed': selecting,
    'aria-label': selecting ? t('Cancel Select') : t('Select')
  },
    h('span', { className: selecting ? 'ic close' : 'ic sel' }),
    h('span', { className: 'btn-label' }, selecting ? t('Cancel Select') : t('Select'))
  );

  const menuControl = h('div', {
        className: 'menu' + (menuOpen ? ' open' : ''),
        id: 'menu',
        onClick: e => e.stopPropagation()
      },
        h('button', {
          className: 'hamburger',
          onClick: e => {
            e.stopPropagation();
            setLangMenuOpen(false);
            setMenuOpen(!menuOpen);
          },
          'aria-label': 'Menu',
          'aria-expanded': menuOpen
        }),
        h('div', { className: 'menu-panel', role: 'menu', 'aria-labelledby': 'hamburger' },
          h('button', { className: 'menu-item', onClick: () => { setMenuOpen(false); openEditor(null); } },
            h('span', { className: 'ic add' }), ' ', t('Add')),
          h('div', { className: 'menu-sep' }),
          h('button', { className: 'menu-item', onClick: () => { setMenuOpen(false); onExport(); } },
            h('span', { className: 'ic exp' }), ' ', t('Export')),
          h('button', { className: 'menu-item', onClick: () => { setMenuOpen(false); if (typeof cloudImport === 'function') cloudImport(); } },
            h('span', { className: 'ic imp' }), ' ', t('Import from Firebase')),
          h('button', { className: 'menu-item', onClick: () => { setMenuOpen(false); if (typeof cloudSave === 'function') cloudSave(); } },
            h('span', { className: 'ic exp' }), ' ', t('Save to Firebase')),
          h('button', { className: 'menu-item' },
            h('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', margin: 0, cursor: 'pointer' } },
              h('span', { className: 'ic imp' }), ' ', t('Import'),
              h('input', {
                type: 'file', accept: '.json,application/json', style: { display: 'none' },
                onChange: e => {
                  const file = e.target.files && e.target.files[0];
                  if (file) onImport(file);
                  e.target.value = '';
                  setMenuOpen(false);
                }
              })
            )
          ),
          h('div', { className: 'menu-sep' }),
          h('button', { className: 'menu-item', onClick: () => { setMenuOpen(false); resetRecipes(); } },
            h('span', { className: 'ic del' }), ' ', t('Reset (forget recipes)')),
        )
      );

  const languageOptions = [
    { code: 'en', label: t('English'), flag: FLAG_EMOJI.en },
    { code: 'es', label: t('Spanish'), flag: FLAG_EMOJI.es },
    { code: 'de', label: t('German'), flag: FLAG_EMOJI.de },
    { code: 'fr', label: t('French'), flag: FLAG_EMOJI.fr }
  ];

  const languageControl = h('div', {
        className: 'lang-menu' + (langMenuOpen ? ' open' : ''),
        onClick: e => e.stopPropagation()
      },
        h('button', {
          className: 'lang-toggle',
          onClick: e => {
            e.stopPropagation();
            setMenuOpen(false);
            setLangMenuOpen(!langMenuOpen);
          },
          'aria-haspopup': 'true',
          'aria-expanded': langMenuOpen,
          'aria-label': t('Language')
        },
          h('span', { className: 'lang-flag', 'aria-hidden': 'true' }, FLAG_EMOJI[lang] || '🌐')
        ),
        h('div', { className: 'lang-panel', role: 'menu' },
          languageOptions.map(opt => h('button', {
            key: opt.code,
            className: 'lang-option' + (opt.code === lang ? ' active' : ''),
            onClick: () => {
              setLang(opt.code);
              setLangMenuOpen(false);
            }
          },
            h('span', { className: 'lang-option-flag', 'aria-hidden': 'true' }, opt.flag || '🌐'),
            h('span', { className: 'lang-option-label' }, opt.label)
          ))
        )
      );

  const Header = h('header', { className: 'app-header' },
    h('div', { className: 'brand' },
      h('img', { className: 'logo', src: 'icons_and_graphs/app_icon.svg', alt: 'Healthy Recipes icon' }),
      h('div', { className: 'brand-copy' },
        h('h1', { className: 'app-title' }, t('Simply Healthy')),
        h('p', { className: 'app-subtitle' }, t('Find easy, healthy recipes for every day') || 'Find easy, healthy recipes for every day')
      )
    ),
    h('div', { className: 'header-actions' },
      h('div', { className: 'menu-stack' },
        h('div', { className: 'menu-row' }, languageControl, menuControl),
        selectToggle
      )
    )
  );

  const SearchBar = h('div', { className: 'searchbar' },
    h('label', { className: 'search-field', title: 'Boolean: comma/+ = AND, / = OR, parentheses ()' },
      h('span', { className: 'ic search', 'aria-hidden': 'true' }),
      h('input', {
        value: searchQuery,
        onChange: e => setSearchQuery(e.target.value),
        placeholder: t('Search recipes…')
      })
    ),
    h('button', { className: 'btn circle', onClick: openAdvanced, 'aria-label': t('Advanced Filter') },
      h('span', { className: 'ic adv' }))
  );

  const QuickFilters = h('div', { className: 'quick-filters' },
    h('button', {
      className: 'chip-button' + (!favoritesOnly ? ' active' : ''),
      onClick: () => { if (favoritesOnly) toggleFavorites(); }
    }, t('Show all')),
    h('button', {
      className: 'chip-button' + (favoritesOnly ? ' active' : ''),
      onClick: () => { if (!favoritesOnly) toggleFavorites(); }
    }, '❤️ ', t('Show favorites'))
  );

  const SelectionBar = selecting ? h('div', { className: 'selection-bar', role: 'region', 'aria-live': 'polite' },
    h('span', { className: 'selection-count' }, `${selectedIds.size} ${t('selected')}`),
    h('div', { className: 'selection-actions' },
      h('button', { className: 'btn soft sm', onClick: selectAllVisible }, h('span', { className: 'ic all' }), t('Select All')),
      h('button', { className: 'btn soft sm', onClick: openShare }, h('span', { className: 'ic share' }), t('Share')),
      h('button', { className: 'btn soft sm danger', onClick: bulkDelete }, h('span', { className: 'ic del' }), t('Delete')),
      h('button', { className: 'btn soft sm', onClick: exitSelection }, t('Cancel Select'))
    )
  ) : null;

  const Stats = h('div', { className: 'result-count' },
    h('span', { className: 'dot' }),
    h('span', null, t('Saved'), ': ',
      h('strong', { id: 'statCount' }, `${visibleRecipes.length} ${t('of')} ${recipes.length}`)
    )
  );

  const Chips = h('div', { className: 'filters-active', id: 'activeFilters' },
    activeFilterChips.map((chip, idx) =>
      h('span', { key: idx, className: 'chip' },
        chip.label, ' ', h('span', { className: 'x', onClick: chip.onRemove }, '✕')
      )
    )
  );

  const Grid = h('div', { className: 'grid', id: 'grid' },
    visibleRecipes.map(r => {
      const selected = selectedIds.has(r.id);
      const { value: nameVal, warning: nameWarn } = getLangField(r, 'name');
      const { value: tagsVal } = getLangField(r, 'tags') || { value: [] };
      const originalTags = r.tags || [];
      const fromSet = favoriteIds && typeof favoriteIds.has === 'function' ? favoriteIds.has(r.id) : false;
      const fromTags = Array.isArray(originalTags) && originalTags.some(t => (t ?? '').toLowerCase() === 'favorite');
      const isFav = fromSet || fromTags;
      const mealTranslated = [];
      const otherTranslated = [];
      for (let i = 0; i < (tagsVal || []).length; i++) {
        const orig = originalTags[i];
        const translated = tagsVal[i];
        if ((orig ?? '').toLowerCase() === 'favorite') continue;
        if (orig && ['Breakfast', 'Lunch', 'Dinner', 'Snack'].includes(orig)) mealTranslated.push(translated);
        else otherTranslated.push(translated);
      }
      const tabLabels = [...mealTranslated, ...otherTranslated.slice(0, 3)].filter(Boolean);
      const countryName = typeof r.country === 'string' ? r.country.trim() : '';
      const countryFlag = countryName ? (FLAG[countryName] || '🌍') : null;
      // Thumbnail
      let thumbUrl = null;
      const vidsVal = getLangField(r, 'videoLinks').value || [];
      let firstVideo = null;
      if (Array.isArray(vidsVal) && vidsVal.length > 0) firstVideo = vidsVal[0];
      else if (Array.isArray(r.videoLinks) && r.videoLinks.length > 0) firstVideo = r.videoLinks[0];
      if (firstVideo && firstVideo.url) {
        const vidId = extractVideoId(firstVideo.url);
        if (vidId) thumbUrl = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }
      if (!thumbUrl) thumbUrl = DEFAULT_THUMB;

      return h('div', {
        key: r.id,
        className: 'card' + (selecting ? ' selecting' : '') + (selected ? ' selected' : ''),
        onClick: e => {
          if (selecting) {
            if (e.target.closest('button')) return;
            toggleSelected(r.id);
          }
        }
      },
      h('div', { className: 'card-media' },
        h('img', {
          src: thumbUrl,
          alt: nameVal || '',
          onError: e => { e.target.onerror = null; e.target.src = DEFAULT_THUMB; }
        }),
        h('div', { className: 'card-health' },
          h('span', { className: 'heart-icon', 'aria-hidden': 'true' }, '💚'),
          h('span', { className: 'health-value' }, r.healthScore != null ? r.healthScore : '—')
        ),
        countryName && h('div', { className: 'card-origin', title: countryName },
          h('span', { className: 'origin-flag', 'aria-hidden': 'true' }, countryFlag),
          h('span', { className: 'origin-name' }, countryName)
        ),
        isFav && h('div', { className: 'favorite-badge', title: t('Favorite') }, '❤️')
      ),
      h('div', { className: 'card-body' },
        h('div', { className: 'name' }, nameVal || '', nameWarn ? h('span', { title: 'English fallback', className: 'fallback-indicator' }, '*') : null),
        tabLabels.length > 0 && h('div', { className: 'card-tabs' },
          tabLabels.map((tg, i) =>
            h('span', { key: 'tab-' + i, className: 'tab-chip' }, tg)
          )
        )
      ),
      h('div', { className: 'card-footer' },
        h('button', { className: 'btn cta sm', onClick: () => openDetail(r) }, h('span', { className: 'ic view' }), t('View recipe')),
        h('button', { className: 'btn soft sm danger', onClick: () => deleteRecipe(r.id) }, h('span', { className: 'ic del' }), t('Delete'))
      ),
      h('div', { className: 'select-box' }, h('span', { className: 'select-tick' }), t('Select'))
    );
    })
  );

  return h(Fragment, null,
    h('div', { className: 'container main-view' }, Header, SearchBar, QuickFilters, Stats, Chips, SelectionBar, Grid)
  );
}
