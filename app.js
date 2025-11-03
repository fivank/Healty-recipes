// App entry: global state, translations, utils, advanced/share pages; renders child components via React.createElement.

import { RecipeList } from './RecipeList.js';
import { RecipeView } from './RecipeView.js';
import { RecipeEditor } from './RecipeEditor.js';
import { importRecipesFromFile, exportRecipesToFile } from './ImportExport.js';

const { useState, useEffect, useMemo, Fragment } = React;
const h = React.createElement;

// Flags, tags, and constants
const FLAG = {
  USA: '🇺🇸', UK: '🇬🇧', 'United Kingdom': '🇬🇧', Canada: '🇨🇦', France: '🇫🇷', Netherlands: '🇳🇱',
  Spain: '🇪🇸', Germany: '🇩🇪', Italy: '🇮🇹', China: '🇨🇳', Japan: '🇯🇵', Thailand: '🇹🇭', Vietnam: '🇻🇳',
  Peru: '🇵🇪', Mexico: '🇲🇽', Argentina: '🇦🇷', Chile: '🇨🇱', Colombia: '🇨🇴', Ecuador: '🇪🇨',
  Venezuela: '🇻🇪', Uruguay: '🇺🇾', Paraguay: '🇵🇾', Bolivia: '🇧🇴', Brazil: '🇧🇷',
  Sweden: '🇸🇪', Norway: '🇳🇴', Denmark: '🇩🇰', Finland: '🇫🇮', Greece: '🇬🇷', Portugal: '🇵🇹'
};
const MEAL = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const DIET = [
  'Vegetarian','Vegan','Seafood','Gluten-Free','High Protein','High Fiber','Beef','Pork','Chicken','Turkey','Lamb','Legume',
  'Keto','Power-Food','Raw','Comfort Food','Low Glycemic Index','Anti-inflammatory','Barbeque','Paleo'
];
const COURSE = ['Soup','Side','Starter','Dessert','Juice','Cream-Soup','Smoothy'];
const DEFAULT_THUMB =
  'https://u7.uidownload.com/vector/69/40/vector-round-frame-of-fresh-juicy-fruits-healthy-diet-vegetarianism-and-veganism-eps-thumbnail.jpg';
const FLAG_EMOJI = { en: '🇬🇧', es: '🇪🇸', de: '🇩🇪', fr: '🇫🇷' };
const LANGS = ['en', 'es', 'de', 'fr'];
const MEAL_COLORS = {
  Breakfast: 'rgba(245,184,77,0.2)', Lunch: 'rgba(240,128,60,0.2)',
  Dinner: 'rgba(128,90,196,0.2)', Snack: 'rgba(52,172,131,0.2)'
};

// Translations (copied from original)
const TRANSLATIONS = {
  en: {
    "Add": "Add","Import": "Import","Export": "Export","Reset (forget recipes)": "Reset (forget recipes)",
    "Search recipes…": "Search recipes…","Advanced": "Advanced","Select": "Select","Cancel Select": "Cancel Select",
    "Select All": "Select All","Share": "Share","Delete": "Delete","Saved": "Filtered recipes saved","of": "of",
    "Advanced Search": "Advanced Filter","Filters": "Filters","Meal (OR inside)": "Meal (OR inside)","Diet": "Diet","Course": "Course",
    "Constraints": "Constraints","Minimum Health Rating": "Minimum Health Rating","Maximum Calories (kcal)": "Maximum Calories (kcal)",
    "Max Preparation Time (minutes)": "Max Preparation Time (minutes)","Countries": "Countries","Reset": "Reset","Apply": "Apply",
    "Back": "Back","View Mode": "View Mode","Tags": "Tags","Info": "Info","Ingredients": "Ingredients","Preparation": "Preparation",
    "Optional / Enrichment": "Optional / Enrichment","Preparation — Advanced": "Preparation — Advanced","Chef Tips": "Chef Tips",
    "Dietitian Tips & Macros": "Dietitian Tips & Macros","Videos": "Videos","Switch to Advanced": "Switch to Advanced",
    "Switch to Simple": "Switch to Simple","View": "View","Edit": "Edit","Name": "Name","Country": "Country","Meal Tags": "Meal Tags",
    "Other Tags": "Other Tags","Health Score (1–10)": "Health Score (1–10)","Calories (kcal)": "Calories (kcal)","Time (minutes)": "Time (minutes)",
    "Difficulty (text)": "Difficulty (text)","Optional Ingredients": "Optional Ingredients","Preparation (Simple)": "Preparation (Simple)",
    "Preparation (Advanced)": "Preparation (Advanced)","Macros (g)": "Macros (g)","Protein": "Protein","Fat": "Fat","Carbs": "Carbs",
    "Save": "Save","Cancel": "Cancel","Share Selected": "Share Selected","selected": "selected","Copy JSON file": "Copy JSON file",
    "Copies the selected recipes as JSON to the clipboard.": "Copies the selected recipes as JSON to the clipboard.",
    "Copy recipe(s) to clipboard": "Copy recipe(s) to clipboard",
    "Copies selected recipes in rich text to the clipboard.": "Copies selected recipes in rich text to the clipboard.",
    "Copy ingredients to clipboard": "Copy ingredients to clipboard",
    "Copies all ingredients of the selected recipes to the clipboard, separated as Main and Optional ingredients.": "Copies all ingredients of the selected recipes to the clipboard, separated as Main and Optional ingredients.",
    "Language": "Language","English": "English","Spanish": "Spanish","German": "German","French": "French",
    "Add Recipe": "Add Recipe","Edit Recipe": "Edit Recipe","Creating": "Creating","Editing": "Editing",
    "Tags (comma separated)": "Tags (comma separated)","Add ingredient": "Add ingredient","Add optional": "Add optional",
    "Add video": "Add video","Remove": "Remove","Video title": "Video title","Dietitian Tips": "Dietitian Tips",
    "Share JSON": "Share JSON","Share PDF": "Share PDF","Share List": "Share List","Recipe": "Recipe",
    "Video available": "Video available","Video": "Video","Copied to clipboard": "Copied to clipboard",
    "Breakfast": "Breakfast","Lunch": "Lunch","Dinner": "Dinner","Snack": "Snack","Vegetarian": "Vegetarian","Vegan": "Vegan",
    "Seafood": "Seafood","Gluten-Free": "Gluten-Free","High Protein": "High Protein","High Fiber": "High Fiber","Beef": "Beef",
    "Pork": "Pork","Chicken": "Chicken","Turkey": "Turkey","Lamb": "Lamb","Legume": "Legume","Keto": "Keto","Power-Food": "Power-Food",
    "Raw": "Raw","Comfort Food": "Comfort Food","Low Glycemic Index": "Low Glycemic Index","Anti-inflammatory": "Anti-inflammatory",
    "Barbeque": "Barbeque","Paleo": "Paleo","Soup": "Soup","Side": "Side","Starter": "Starter","Dessert": "Dessert","Juice": "Juice",
    "Cream-Soup": "Cream-Soup","Smoothy": "Smoothy"
  },
  es: {
    "Add": "Añadir","Import": "Importar","Export": "Exportar","Reset (forget recipes)": "Restablecer (olvidar recetas)",
    "Search recipes…": "Buscar recetas…","Advanced": "Avanzado","Select": "Seleccionar","Cancel Select": "Cancelar selección",
    "Select All": "Seleccionar todo","Share": "Compartir","Delete": "Eliminar","Saved": "Recetas filtradas guardadas","of": "de",
    "Advanced Search": "Filtro avanzada","Filters": "Filtros","Meal (OR inside)": "Comida (OR dentro)","Diet": "Dieta","Course": "Curso",
    "Constraints": "Restricciones","Minimum Health Rating": "Puntuación mínima de salud","Maximum Calories (kcal)": "Calorías máximas (kcal)",
    "Max Preparation Time (minutes)": "Tiempo máximo de preparación (minutos)","Countries": "Países","Reset": "Restablecer","Apply": "Aplicar",
    "Back": "Atrás","View Mode": "Modo de vista","Tags": "Etiquetas","Info": "Información","Ingredients": "Ingredientes","Preparation": "Preparación",
    "Optional / Enrichment": "Opcional / Enriquecimiento","Preparation — Advanced": "Preparación — Avanzada","Chef Tips": "Consejos del chef",
    "Dietitian Tips & Macros": "Consejos del dietista y macros","Videos": "Videos","Switch to Advanced": "Cambiar a avanzado",
    "Switch to Simple": "Cambiar a simple","View": "Ver","Edit": "Editar","Name": "Nombre","Country": "País","Meal Tags": "Etiquetas de comida",
    "Other Tags": "Otras etiquetas","Health Score (1–10)": "Puntuación de salud (1–10)","Calories (kcal)": "Calorías (kcal)",
    "Time (minutes)": "Tiempo (minutos)","Difficulty (text)": "Dificultad (texto)","Optional Ingredients": "Ingredientes opcionales",
    "Preparation (Simple)": "Preparación (simple)","Preparation (Advanced)": "Preparación (avanzada)","Macros (g)": "Macros (g)",
    "Protein": "Proteína","Fat": "Grasa","Carbs": "Carbohidratos","Save": "Guardar","Cancel": "Cancelar","Share Selected": "Compartir seleccionados",
    "selected": "seleccionado(s)","Copy JSON file": "Copiar archivo JSON","Copies the selected recipes as JSON to the clipboard.": "Copia las recetas seleccionadas como JSON al portapapeles.",
    "Copy recipe(s) to clipboard": "Copiar receta(s) al portapapeles","Copies selected recipes in rich text to the clipboard.": "Copia las recetas seleccionadas en texto enriquecido al portapapeles.",
    "Copy ingredients to clipboard": "Copiar ingredientes al portapapeles","Copies all ingredients of the selected recipes to the clipboard, separated as Main and Optional ingredients.": "Copia todos los ingredientes de las recetas seleccionadas al portapapeles, separados en principales y opcionales.",
    "Language": "Idioma","English": "Inglés","Spanish": "Español","German": "Alemán","French": "Francés",
    "Add Recipe": "Añadir receta","Edit Recipe": "Editar receta","Creating": "Creando","Editing": "Editando",
    "Tags (comma separated)": "Etiquetas (separadas por coma)","Add ingredient": "Añadir ingrediente","Add optional": "Añadir opcional",
    "Add video": "Añadir video","Remove": "Eliminar","Video title": "Título del video","Dietitian Tips": "Consejos del dietista",
    "Share JSON": "Compartir JSON","Share PDF": "Compartir PDF","Share List": "Compartir lista","Recipe": "Receta","Video available": "Video disponible",
    "Video": "Video","Copied to clipboard": "Copiado al portapapeles","Breakfast": "Desayuno","Lunch": "Almuerzo","Dinner": "Cena","Snack": "Snack",
    "Vegetarian": "Vegetariano","Vegan": "Vegano","Seafood": "Mariscos","Gluten-Free": "Sin Gluten","High Protein": "Alto en proteína",
    "High Fiber": "Alto en fibra","Beef": "Res","Pork": "Cerdo","Chicken": "Pollo","Turkey": "Pavo","Lamb": "Cordero","Legume": "Legumbres",
    "Keto": "Keto","Power-Food": "Superalimento","Raw": "Crudo","Comfort Food": "Comida reconfortante","Low Glycemic Index": "Bajo índice glucémico",
    "Anti-inflammatory": "Antiinflamatorio","Barbeque": "Barbacoa","Paleo": "Paleo","Soup": "Sopa","Side": "Acompañamiento","Starter": "Entrante",
    "Dessert": "Postre","Juice": "Jugo","Cream-Soup": "Crema","Smoothy": "Batido"
  },
  de: {
    "Add": "Hinzufügen","Import": "Importieren","Export": "Exportieren","Reset (forget recipes)": "Zurücksetzen (Rezepte vergessen)",
    "Search recipes…": "Rezepte suchen…","Advanced": "Erweitert","Select": "Auswählen","Cancel Select": "Auswahl abbrechen",
    "Select All": "Alle auswählen","Share": "Teilen","Delete": "Löschen","Saved": "Gespeicherte gefilterte Rezepte","of": "von",
    "Advanced Search": "Erweiterte Filter","Filters": "Filter","Meal (OR inside)": "Mahlzeit (ODER innen)","Diet": "Ernährung","Course": "Gang",
    "Constraints": "Einschränkungen","Minimum Health Rating": "Mindestgesundheitsbewertung","Maximum Calories (kcal)": "Maximale Kalorien (kcal)",
    "Max Preparation Time (minutes)": "Maximale Zubereitungszeit (Minuten)","Countries": "Länder","Reset": "Zurücksetzen","Apply": "Anwenden",
    "Back": "Zurück","View Mode": "Ansichtsmodus","Tags": "Tags","Info": "Informationen","Ingredients": "Zutaten","Preparation": "Zubereitung",
    "Optional / Enrichment": "Optional / Anreicherung","Preparation — Advanced": "Zubereitung — Fortgeschritten","Chef Tips": "Chef-Tipps",
    "Dietitian Tips & Macros": "Ernährungsberater-Tipps & Makros","Videos": "Videos","Switch to Advanced": "Zu Erweitert wechseln",
    "Switch to Simple": "Zu Einfach wechseln","View": "Ansicht","Edit": "Bearbeiten","Name": "Name","Country": "Land",
    "Meal Tags": "Mahlzeit-Tags","Other Tags": "Andere Tags","Health Score (1–10)": "Gesundheitswert (1–10)","Calories (kcal)": "Kalorien (kcal)",
    "Time (minutes)": "Zeit (Minuten)","Difficulty (text)": "Schwierigkeit (Text)","Optional Ingredients": "Optionale Zutaten",
    "Preparation (Simple)": "Zubereitung (einfach)","Preparation (Advanced)": "Zubereitung (fortgeschritten)","Macros (g)": "Makros (g)",
    "Protein": "Protein","Fat": "Fett","Carbs": "Kohlenhydrate","Save": "Speichern","Cancel": "Abbrechen","Share Selected": "Ausgewählte teilen",
    "selected": "ausgewählt","Copy JSON file": "JSON-Datei kopieren",
    "Copies the selected recipes as JSON to the clipboard.": "Kopiert die ausgewählten Rezepte als JSON in die Zwischenablage.",
    "Copy recipe(s) to clipboard": "Rezept(e) in die Zwischenablage kopieren",
    "Copies selected recipes in rich text to the clipboard.": "Kopiert ausgewählte Rezepte als Rich Text in die Zwischenablage.",
    "Copy ingredients to clipboard": "Zutaten in die Zwischenablage kopieren",
    "Copies all ingredients of the selected recipes to the clipboard, separated as Main and Optional ingredients.": "Kopiert alle Zutaten der ausgewählten Rezepte in die Zwischenablage, getrennt in Haupt- und optionale Zutaten.",
    "Language": "Sprache","English": "Englisch","Spanish": "Spanisch","German": "Deutsch","French": "Französisch",
    "Add Recipe": "Rezept hinzufügen","Edit Recipe": "Rezept bearbeiten","Creating": "Erstellen","Editing": "Bearbeitung",
    "Tags (comma separated)": "Tags (kommagetrennt)","Add ingredient": "Zutat hinzufügen","Add optional": "Optional hinzufügen",
    "Add video": "Video hinzufügen","Remove": "Entfernen","Video title": "Videotitel","Dietitian Tips": "Diätetische Tipps",
    "Share JSON": "JSON teilen","Share PDF": "PDF teilen","Share List": "Liste teilen","Recipe": "Rezept","Video available": "Video verfügbar",
    "Video": "Video","Copied to clipboard": "In die Zwischenablage kopiert","Breakfast": "Frühstück","Lunch": "Mittagessen","Dinner": "Abendessen",
    "Snack": "Snack","Vegetarian": "Vegetarisch","Vegan": "Vegan","Seafood": "Meeresfrüchte","Gluten-Free": "Glutenfrei","High Protein": "Eiweißreich",
    "High Fiber": "Ballaststoffreich","Beef": "Rind","Pork": "Schwein","Chicken": "Hähnchen","Turkey": "Pute","Lamb": "Lamm","Legume": "Hülsenfrüchte",
    "Keto": "Keto","Power-Food": "Power-Food","Raw": "Roh","Comfort Food": "Hausmannskost","Low Glycemic Index": "Niedriger glykämischer Index",
    "Anti-inflammatory": "Entzündungshemmend","Barbeque": "Barbecue","Paleo": "Paleo","Soup": "Suppe","Side": "Beilage","Starter": "Vorspeise",
    "Dessert": "Dessert","Juice": "Saft","Cream-Soup": "Cremesuppe","Smoothy": "Smoothie"
  },
  fr: {
    "Add": "Ajouter","Import": "Importer","Export": "Exporter","Reset (forget recipes)": "Réinitialiser (oublier les recettes)",
    "Search recipes…": "Rechercher des recettes…","Advanced": "Avancé","Select": "Sélectionner","Cancel Select": "Annuler la sélection",
    "Select All": "Tout sélectionner","Share": "Partager","Delete": "Supprimer","Saved": "Recettes filtrées enregistrées","of": "sur",
    "Advanced Search": "Recherche avancée","Filters": "Filtres","Meal (OR inside)": "Repas (OU à l'intérieur)","Diet": "Régime","Course": "Cours",
    "Constraints": "Contraintes","Minimum Health Rating": "Note de santé minimale","Maximum Calories (kcal)": "Calories maximales (kcal)",
    "Max Preparation Time (minutes)": "Temps de préparation maximal (minutes)","Countries": "Pays","Reset": "Réinitialiser","Apply": "Appliquer",
    "Back": "Retour","View Mode": "Mode d'affichage","Tags": "Étiquettes","Info": "Infos","Ingredients": "Ingrédients","Preparation": "Préparation",
    "Optional / Enrichment": "Optionnel / Enrichissement","Preparation — Advanced": "Préparation — Avancée","Chef Tips": "Conseils du chef",
    "Dietitian Tips & Macros": "Conseils du diététiste & macros","Videos": "Vidéos","Switch to Advanced": "Passer en mode avancé",
    "Switch to Simple": "Passer en mode simple","View": "Voir","Edit": "Modifier","Name": "Nom","Country": "Pays","Meal Tags": "Tags de repas",
    "Other Tags": "Autres tags","Health Score (1–10)": "Score santé (1–10)","Calories (kcal)": "Calories (kcal)","Time (minutes)": "Temps (minutes)",
    "Difficulty (text)": "Difficulté (texte)","Optional Ingredients": "Ingrédients optionnels","Preparation (Simple)": "Préparation (simple)",
    "Preparation (Advanced)": "Préparation (avancée)","Macros (g)": "Macros (g)","Protein": "Protéine","Fat": "Lipides","Carbs": "Glucides",
    "Save": "Enregistrer","Cancel": "Annuler","Share Selected": "Partager les sélectionnés","selected": "sélectionné(s)",
    "Copy JSON file": "Copier le fichier JSON","Copies the selected recipes as JSON to the clipboard.": "Copie les recettes sélectionnées comme JSON dans le presse-papiers.",
    "Copy recipe(s) to clipboard": "Copier la/les recette(s) dans le presse-papiers",
    "Copies selected recipes in rich text to the clipboard.": "Copie les recettes sélectionnées en texte enrichi dans le presse-papiers.",
    "Copy ingredients to clipboard": "Copier les ingrédients dans le presse-papiers",
    "Copies all ingredients of the selected recipes to the clipboard, separated as Main and Optional ingredients.": "Copie tous les ingrédients des recettes sélectionnées dans le presse-papiers, séparés en ingrédients principaux et facultatifs.",
    "Language": "Langue","English": "Anglais","Spanish": "Espagnol","German": "Allemand","French": "Français",
    "Add Recipe": "Ajouter une recette","Edit Recipe": "Modifier la recette","Creating": "Création","Editing": "Modification",
    "Tags (comma separated)": "Tags (séparés par des virgules)","Add ingredient": "Ajouter un ingrédient","Add optional": "Ajouter optionnel",
    "Add video": "Ajouter une vidéo","Remove": "Supprimer","Video title": "Titre de la vidéo","Dietitian Tips": "Conseils du diététiste",
    "Share JSON": "Partager JSON","Share PDF": "Partager PDF","Share List": "Partager la liste","Recipe": "Recette","Video available": "Vidéo disponible",
    "Video": "Vidéo","Copied to clipboard": "Copié dans le presse-papiers","Breakfast": "Petit-déjeuner","Lunch": "Déjeuner","Dinner": "Dîner",
    "Snack": "Collation","Vegetarian": "Végétarien","Vegan": "Végétalien","Seafood": "Fruits de mer","Gluten-Free": "Sans gluten",
    "High Protein": "Riche en protéines","High Fiber": "Riche en fibres","Beef": "Bœuf","Pork": "Porc","Chicken": "Poulet","Turkey": "Dinde",
    "Lamb": "Agneau","Legume": "Légumineuse","Keto": "Keto","Power-Food": "Super-aliment","Raw": "Cru","Comfort Food": "Plat réconfortant",
    "Low Glycemic Index": "Index glycémique bas","Anti-inflammatory": "Anti-inflammatoire","Barbeque": "Barbecue","Paleo": "Paléo",
    "Soup": "Soupe","Side": "Accompagnement","Starter": "Entrée","Dessert": "Dessert","Juice": "Jus","Cream-Soup": "Velouté","Smoothy": "Smoothie"
  }
};

// Utils
function loadRecipes() {
  try { const raw = localStorage.getItem('recipes'); if (!raw) return []; const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : []; }
  catch { return []; }
}
function saveRecipes(rs) { try { localStorage.setItem('recipes', JSON.stringify(rs)); } catch {} }
function normalizeRecipe(r) {
  if (!r) return r;
  const translatable = ['name','tags','ingredients','optionalIngredients','preparationSimple','preparationAdvanced','chefTips','dietitianTips','videoLinks'];
  if (!r.i18n) {
    const i18n = { en: {} };
    translatable.forEach(k => { const v = r[k]; i18n.en[k] = Array.isArray(v) ? JSON.parse(JSON.stringify(v)) : v; });
    r.i18n = i18n;
  }
  if (!Array.isArray(r.tags) || r.tags.length === 0) {
    if (r.i18n?.en?.tags) r.tags = [...r.i18n.en.tags];
  }
  return r;
}
function tokenizeBoolean(query) {
  let q = (query || '').trim();
  if (!q) return null;
  return q.replace(/\s+/g, ' ').replace(/,/g, ' AND ').replace(/\+/g, ' AND ').replace(/\//g, ' OR ').replace(/\s+(AND|OR)\s+/g, ' $1 ');
}
function buildLangSearchPredicate(query, getLangField) {
  const tok = tokenizeBoolean(query);
  if (!tok) return () => true;
  const out = []; const ops = []; const terms = tok.match(/\(|\)|AND|OR|[^()\s]+/g) || []; const prec = { AND: 2, OR: 1 };
  for (const t of terms) {
    if (t === 'AND' || t === 'OR') { while (ops.length && ops[ops.length - 1] !== '(' && prec[ops[ops.length - 1]] >= prec[t]) out.push(ops.pop()); ops.push(t); }
    else if (t === '(') ops.push(t);
    else if (t === ')') { while (ops.length && ops[ops.length - 1] !== '(') out.push(ops.pop()); ops.pop(); }
    else out.push({ term: t.toLowerCase() });
  }
  while (ops.length) out.push(ops.pop());
  return r => {
    const stack = [];
    const { value: nameVal } = getLangField(r, 'name');
    const { value: tagsVal } = getLangField(r, 'tags');
    const { value: ingredientsVal } = getLangField(r, 'ingredients');
    const { value: optionalVal } = getLangField(r, 'optionalIngredients');
    const hayParts = [];
    if (nameVal) hayParts.push(Array.isArray(nameVal) ? nameVal.join(' ') : String(nameVal));
    if (r.country) hayParts.push(r.country);
    if (tagsVal && Array.isArray(tagsVal)) hayParts.push(tagsVal.join(' '));
    if (ingredientsVal && Array.isArray(ingredientsVal)) hayParts.push(ingredientsVal.map(i => i.name).join(' '));
    if (optionalVal && Array.isArray(optionalVal)) hayParts.push(optionalVal.map(i => i.name).join(' '));
    const hay = hayParts.join(' ').toLowerCase();
    for (const node of out) {
      if (node.term) stack.push(hay.includes(node.term));
      else { const b = stack.pop(); const a = stack.pop(); stack.push(node === 'AND' ? a && b : a || b); }
    }
    return stack.pop() ?? true;
  };
}
function extractVideoId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.replace(/^\//, '');
    if (u.searchParams.has('v')) return u.searchParams.get('v');
    const parts = u.pathname.split('/'); const possibleId = parts.pop() || parts.pop();
    if (possibleId && /^[A-Za-z0-9_-]{11}$/.test(possibleId)) return possibleId;
  } catch {}
  return null;
}

function App() {
  const [recipes, setRecipes] = useState(() => (loadRecipes() || []).map(normalizeRecipe));
  const [searchQuery, setSearchQuery] = useState('');
  const [advanced, setAdvanced] = useState({ meal: new Set(), diet: new Set(), course: new Set(), countries: new Set(), minHealth: 1, maxKcal: null, maxTime: null });
  const [selecting, setSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState('list');
  const [detailRecipe, setDetailRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareRecipes, setShareRecipes] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const [lang, setLang] = useState('en');
  const [advCollapse, setAdvCollapse] = useState({ meal: false, diet: false, course: false, constraints: false, countries: false });

  useEffect(() => saveRecipes(recipes), [recipes]);

  // Seed (note: some preview servers block file:// fetch; use http if needed)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recipes') || '[]');
      if (Array.isArray(stored) && stored.length > 0) return;
    } catch {}
    (async () => {
      try {
        const res = await fetch('./default_recipes.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        const items = data?.recipes || (Array.isArray(data) ? data : []);
        if (!Array.isArray(items) || items.length === 0) return;
        const map = new Map();
        items.forEach(r => {
          const copy = normalizeRecipe({ ...r });
          if (!copy.id) {
            const slug = (copy.name || 'recipe').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            copy.id = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
          }
          map.set(copy.id, copy);
        });
        setRecipes(Array.from(map.values()));
      } catch (err) { console.warn('Default seed load failed:', err); }
    })();
  }, []);

  const t = (key, vars = {}) => {
    let str = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || (TRANSLATIONS.en && TRANSLATIONS.en[key]) || key;
    Object.entries(vars).forEach(([k, v]) => { str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v); });
    return str;
  };
  const getLangField = (r, field) => {
    if (r?.i18n?.[lang]?.[field] !== undefined) {
      const val = r.i18n[lang][field];
      return { value: Array.isArray(val) ? JSON.parse(JSON.stringify(val)) : val, warning: false };
    }
    if (r?.i18n?.en?.[field] !== undefined) {
      const val = r.i18n.en[field];
      return { value: Array.isArray(val) ? JSON.parse(JSON.stringify(val)) : val, warning: true };
    }
    if (r && r[field] !== undefined) {
      const val = r[field];
      return { value: Array.isArray(val) ? JSON.parse(JSON.stringify(val)) : val, warning: false };
    }
    if (['tags','ingredients','optionalIngredients','videoLinks'].includes(field)) return { value: [], warning: false };
    return { value: '', warning: false };
  };

  const searchPredicate = useMemo(() => buildLangSearchPredicate(searchQuery, getLangField), [searchQuery, lang]);

  const matchesAdvanced = r => {
    if ((r.healthScore || 0) < (advanced.minHealth || 1)) return false;
    if (advanced.maxKcal != null && (r.calories || 0) > advanced.maxKcal) return false;
    if (advanced.maxTime != null && (r.timeMinutes || 9999) > advanced.maxTime) return false;
    if (advanced.meal.size) { const tags = r.tags || []; if (![...advanced.meal].some(tag => tags.includes(tag))) return false; }
    for (const d of advanced.diet) if (!(r.tags || []).includes(d)) return false;
    for (const c of advanced.course) if (!(r.tags || []).includes(c)) return false;
    if (advanced.countries.size && !advanced.countries.has(r.country)) return false;
    return true;
  };

  const visibleRecipes = useMemo(() => recipes.filter(r => searchPredicate(r) && matchesAdvanced(r)), [recipes, searchPredicate, advanced]);

  useEffect(() => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      for (const id of prev) if (!visibleRecipes.some(r => r.id === id)) next.delete(id);
      return next;
    });
  }, [visibleRecipes]);

  const collectCountries = useMemo(() => {
    const base = [
      'USA','UK','Canada','France','Netherlands','Spain','Germany','Italy','China','Japan','Thailand','Vietnam',
      'Peru','Mexico','Argentina','Chile','Colombia','Ecuador','Venezuela','Uruguay','Paraguay','Bolivia','Brazil',
      'Sweden','Norway','Denmark','Finland'
    ];
    const have = Array.from(new Set(recipes.map(r => r.country).filter(Boolean)));
    return Array.from(new Set([...have, ...base])).sort();
  }, [recipes]);

  // Chips
  const activeFilterChips = [];
  if (advanced.meal.size) for (const m of advanced.meal) activeFilterChips.push({ label: m, onRemove: () => setAdvanced(p => ({ ...p, meal: new Set([...p.meal].filter(x => x !== m)) })) });
  if (advanced.diet.size) for (const d of advanced.diet) activeFilterChips.push({ label: d, onRemove: () => setAdvanced(p => ({ ...p, diet: new Set([...p.diet].filter(x => x !== d)) })) });
  if (advanced.course.size) for (const c of advanced.course) activeFilterChips.push({ label: c, onRemove: () => setAdvanced(p => ({ ...p, course: new Set([...p.course].filter(x => x !== c)) })) });
  if (advanced.countries.size) for (const ct of advanced.countries) activeFilterChips.push({ label: ct, onRemove: () => setAdvanced(p => ({ ...p, countries: new Set([...p.countries].filter(x => x !== ct)) })) });
  if (advanced.minHealth && advanced.minHealth > 1) activeFilterChips.push({ label: `Health ≥ ${advanced.minHealth}`, onRemove: () => setAdvanced(p => ({ ...p, minHealth: 1 })) });
  if (advanced.maxKcal != null) activeFilterChips.push({ label: `Kcal ≤ ${advanced.maxKcal}`, onRemove: () => setAdvanced(p => ({ ...p, maxKcal: null })) });
  if (advanced.maxTime != null) activeFilterChips.push({ label: `Time ≤ ${advanced.maxTime}m`, onRemove: () => setAdvanced(p => ({ ...p, maxTime: null })) });

  // Navigation and handlers
  const openDetail = r => { setDetailRecipe(r); setCurrentPage('detail'); };
  const closeDetail = () => { setDetailRecipe(null); setCurrentPage('list'); };
  const openAdvanced = () => setCurrentPage('advanced');
  const closeAdvanced = () => setCurrentPage('list');
  const openEditor = recipe => {
    if (recipe) {
      setIsCreate(false);
      const cloned = JSON.parse(JSON.stringify(recipe));
      cloned.i18n = cloned.i18n || {}; cloned.i18n.en = cloned.i18n.en || {};
      ['name','preparationSimple','preparationAdvanced','chefTips','dietitianTips'].forEach(f => {
        if (!cloned[f] || cloned[f] === '') if (cloned.i18n.en && cloned.i18n.en[f] !== undefined) cloned[f] = cloned.i18n.en[f];
      });
      if (!Array.isArray(cloned.tags) || cloned.tags.length === 0) if (Array.isArray(cloned.i18n.en.tags)) cloned.tags = [...cloned.i18n.en.tags];
      if ((!cloned.ingredients || cloned.ingredients.length === 0) && Array.isArray(cloned.i18n.en.ingredients)) cloned.ingredients = JSON.parse(JSON.stringify(cloned.i18n.en.ingredients));
      if ((!cloned.optionalIngredients || cloned.optionalIngredients.length === 0) && Array.isArray(cloned.i18n.en.optionalIngredients)) cloned.optionalIngredients = JSON.parse(JSON.stringify(cloned.i18n.en.optionalIngredients));
      setEditingRecipe(cloned);
    } else {
      setIsCreate(true);
      setEditingRecipe({
        id: null, country: 'Peru', tags: [], ingredients: [], optionalIngredients: [], calories: 0,
        macros: { protein: 0, fat: 0, carbs: 0 }, healthScore: 5, difficulty: 'Easy', timeMinutes: 0, videoLinks: [],
        name: '', preparationSimple: '', preparationAdvanced: '', chefTips: '', dietitianTips: '',
        i18n: { en: { name: '', tags: [], ingredients: [], optionalIngredients: [], preparationSimple: '', preparationAdvanced: '', chefTips: '', dietitianTips: '', videoLinks: [] }, es: {}, de: {}, fr: {} }
      });
    }
    setCurrentPage('editor');
  };
  const closeEditor = () => { setEditingRecipe(null); setCurrentPage('list'); };
  const saveEditedRecipe = edited => {
    if (edited.i18n) {
      edited.i18n.en = edited.i18n.en || {};
      ['name','tags','ingredients','optionalIngredients','preparationSimple','preparationAdvanced','chefTips','dietitianTips','videoLinks'].forEach(key => {
        if (edited[key] !== undefined) edited.i18n.en[key] = Array.isArray(edited[key]) ? JSON.parse(JSON.stringify(edited[key])) : edited[key];
      });
    }
    if (!edited.name || !edited.name.trim()) { alert('Please enter a name'); return; }
    if (isCreate) {
      const slug = edited.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      edited.id = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      setRecipes([edited, ...recipes]);
    } else {
      setRecipes(recipes.map(r => (r.id === editingRecipe.id ? edited : r)));
    }
    closeEditor(); setDetailRecipe(edited); setCurrentPage('detail');
  };

  // Selection
  const enterSelection = () => { setSelecting(true); setSelectedIds(new Set()); };
  const exitSelection = () => { setSelecting(false); setSelectedIds(new Set()); };
  const toggleSelected = id => setSelectedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const selectAllVisible = () => { const ids = new Set(selectedIds); visibleRecipes.forEach(r => ids.add(r.id)); setSelectedIds(ids); };
  const bulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} selected recipe(s)?`)) return;
    setRecipes(recipes.filter(r => !selectedIds.has(r.id))); setSelectedIds(new Set()); setSelecting(false);
  };
  const deleteRecipe = id => { if (!window.confirm('Delete this recipe?')) return; setRecipes(recipes.filter(r => r.id !== id)); };

  // Share
  const openShare = () => { const items = recipes.filter(r => selectedIds.has(r.id)); setShareRecipes(items); setCurrentPage('share'); };
  const closeShare = () => setCurrentPage('list');
  const shareCurrentRecipe = () => { if (!detailRecipe) return; setShareRecipes([detailRecipe]); setCurrentPage('share'); };

  // Toast
  const showToast = msg => setToastMsg(msg);
  useEffect(() => { if (toastMsg) { const t = setTimeout(() => setToastMsg(null), 3000); return () => clearTimeout(t); } }, [toastMsg]);

  // Advanced toggles
  const toggleAdvCollapse = key => setAdvCollapse(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleFilterSet = (group, value) => setAdvanced(prev => { const next = { ...prev }; const set = new Set(next[group]); set.has(value) ? set.delete(value) : set.add(value); next[group] = set; return next; });
  const toggleCountry = c => setAdvanced(prev => { const next = { ...prev }; const set = new Set(next.countries); set.has(c) ? set.delete(c) : set.add(c); next.countries = set; return next; });
  const clearAdvanced = () => setAdvanced({ meal: new Set(), diet: new Set(), course: new Set(), countries: new Set(), minHealth: 1, maxKcal: null, maxTime: null });
  const applyAdvanced = () => setCurrentPage('list');

  // Import/Export/Reset
  const handleImport = async file => {
    try {
      const items = await importRecipesFromFile(file);
      const map = new Map(recipes.map(r => [r.id, r]));
      items.forEach(r => {
        const nr = normalizeRecipe(r);
        if (nr && nr.id) map.set(nr.id, nr); else map.set('import-' + Math.random().toString(36).slice(2), nr);
      });
      setRecipes(Array.from(map.values()));
    } catch (err) { alert('Import failed: ' + err.message); }
  };
  const handleExport = () => exportRecipesToFile(recipes);
  const resetRecipes = () => {
    if (!window.confirm('This will remove all saved recipes from this browser. Continue?')) return;
    localStorage.setItem('recipes', '[]');
    setRecipes([]); setAdvanced({ meal: new Set(), diet: new Set(), course: new Set(), countries: new Set(), minHealth: 1, maxKcal: null, maxTime: null });
    setSearchQuery(''); setSelecting(false); setSelectedIds(new Set());
  };

  // Advanced page
  const AdvancedPage = h('section', { className: 'page', style: { display: 'block' }, id: 'pageAdvanced' },
    h('header', null,
      h('button', { className: 'back', onClick: closeAdvanced }, h('span', { className: 'ic back' }), ' ', t('Back')),
      h('div', { className: 'title' }, t('Advanced Search')),
      h('div', { style: { opacity: 0.7, fontSize: '12px' } }, t('Filters'))
    ),
    h('div', { className: 'wrap' },
      h('div', { className: 'grid-adv' },
        h('div', { className: 'block' },
          h('h4', { onClick: () => toggleAdvCollapse('meal'), style: { cursor: 'pointer' } }, (advCollapse.meal ? '▾' : '▸') + ' ' + t('Meal (OR inside)')),
          advCollapse.meal && h('div', { className: 'state-list' },
            MEAL.map(m => h('div', {
              key: m,
              className: 'state' + (advanced.meal.has(m) ? ' on' : ''),
              onClick: () => toggleFilterSet('meal', m)
              // removed inline color style to unify appearance
            }, t(m)))
          ),
          h('div', { className: 'divider' }),
          h('h4', { onClick: () => toggleAdvCollapse('diet'), style: { cursor: 'pointer' } }, (advCollapse.diet ? '▾' : '▸') + ' ' + t('Diet')),
          advCollapse.diet && h('div', { className: 'state-list' },
            [...new Set(DIET)].map(d => h('div', { key: d, className: 'state' + (advanced.diet.has(d) ? ' on' : ''), onClick: () => toggleFilterSet('diet', d) }, t(d)))
          ),
          h('div', { style: { height: '8px' } }),
          h('h4', { onClick: () => toggleAdvCollapse('course'), style: { cursor: 'pointer' } }, (advCollapse.course ? '▾' : '▸') + ' ' + t('Course')),
          advCollapse.course && h('div', { className: 'state-list' },
            COURSE.map(c => h('div', { key: c, className: 'state' + (advanced.course.has(c) ? ' on' : ''), onClick: () => toggleFilterSet('course', c) }, t(c)))
          )
        ),
        h('div', { className: 'block' },
          h('h4', { onClick: () => toggleAdvCollapse('constraints'), style: { cursor: 'pointer' } }, (advCollapse.constraints ? '▾' : '▸') + ' ' + t('Constraints')),
          advCollapse.constraints && h('div', { className: 'range' },
            h('label', null, t('Minimum Health Rating'), ' ', h('span', null, `${advanced.minHealth}/10`)),
            h('input', { type: 'range', min: 1, max: 10, step: 1, value: advanced.minHealth, onChange: e => setAdvanced(p => ({ ...p, minHealth: parseInt(e.target.value, 10) })) }),
            h('label', null, t('Maximum Calories (kcal)'), ' ', h('span', null, advanced.maxKcal != null ? advanced.maxKcal : '—')),
            h('input', { type: 'range', min: 0, max: 3000, step: 10, value: advanced.maxKcal != null ? advanced.maxKcal : 0, onChange: e => setAdvanced(p => ({ ...p, maxKcal: parseInt(e.target.value, 10) })) }),
            h('input', { type: 'number', min: 0, max: 3000, step: 10, value: advanced.maxKcal != null ? advanced.maxKcal : '', onChange: e => setAdvanced(p => ({ ...p, maxKcal: e.target.value.trim() === '' ? null : parseInt(e.target.value, 10) })) }),
            h('label', null, t('Max Preparation Time (minutes)'), ' ', h('span', null, advanced.maxTime != null ? advanced.maxTime : '—')),
            h('input', { type: 'range', min: 0, max: 180, step: 5, value: advanced.maxTime != null ? advanced.maxTime : 0, onChange: e => setAdvanced(p => ({ ...p, maxTime: parseInt(e.target.value, 10) })) }),
            h('input', { type: 'number', min: 0, max: 180, step: 5, value: advanced.maxTime != null ? advanced.maxTime : '', onChange: e => setAdvanced(p => ({ ...p, maxTime: e.target.value.trim() === '' ? null : parseInt(e.target.value, 10) })) })
          )
        ),
        h('div', { className: 'block' },
          h('h4', { onClick: () => toggleAdvCollapse('countries'), style: { cursor: 'pointer' } }, (advCollapse.countries ? '▾' : '▸') + ' ' + t('Countries')),
          advCollapse.countries && h('div', { className: 'flag-list' },
            collectCountries.map(cty => h('div', { key: cty, className: 'flag-item' + (advanced.countries.has(cty) ? ' on' : ''), onClick: () => toggleCountry(cty) },
              h('span', { className: 'flag' }, FLAG[cty] || '🏳️'), h('span', null, cty)))
          )
        )
      )
    ),
    h('footer', null,
      h('button', { className: 'btn', onClick: () => { clearAdvanced(); closeAdvanced(); } }, t('Reset')),
      h('button', { className: 'btn primary', onClick: applyAdvanced }, t('Apply'))
    )
  );

  const SharePage = h('section', { className: 'page', style: { display: 'block' }, id: 'pageShare' },
    h('header', null,
      h('button', { className: 'back', onClick: closeShare }, h('span', { className: 'ic back' }), ' ', t('Back')),
      h('div', { className: 'title' }, t('Share Selected')),
      h('div', { style: { opacity: 0.7, fontSize: '12px' } }, `${shareRecipes.length} ${t('selected')}`)
    ),
    h('div', { className: 'wrap' },
      h('div', { className: 'share-grid' },
        h('div', { className: 'share-card' },
          h('div', { style: { fontWeight: 700 } }, t('Copy JSON file')),
          h('div', { className: 'muted' }, t('Copies the selected recipes as JSON to the clipboard.')),
          h('button', { className: 'btn sm icon', onClick: async () => {
            const items = shareRecipes;
            const payload = { app: 'HealthyRecipeApp', version: 1, exportedAt: new Date().toISOString(), count: items.length, recipes: items };
            const json = JSON.stringify(payload, null, 2);
            try { await navigator.clipboard.writeText(json); } catch {}
            if (navigator.canShare && navigator.share) navigator.share({ text: json, title: 'Recipes' }).catch(() => {});
            setToastMsg(t('Copied to clipboard'));
          } }, h('span', { className: 'ic share' }), ' ', t('Copy JSON file'))
        ),
        h('div', { className: 'share-card' },
          h('div', { style: { fontWeight: 700 } }, t('Copy recipe(s) to clipboard')),
          h('div', { className: 'muted' }, t('Copies selected recipes in rich text to the clipboard.')),
          h('button', { className: 'btn sm icon', onClick: async () => {
            const lines = [];
            shareRecipes.forEach(r => {
              const { value: nm } = getLangField(r, 'name');
              const { value: tagsVal } = getLangField(r, 'tags');
              const { value: ings } = getLangField(r, 'ingredients');
              const { value: optIngs } = getLangField(r, 'optionalIngredients');
              const { value: prepSimple } = getLangField(r, 'preparationSimple');
              const { value: prepAdv } = getLangField(r, 'preparationAdvanced');
              const { value: chefTips } = getLangField(r, 'chefTips');
              const { value: dietTips } = getLangField(r, 'dietitianTips');
              lines.push(`${nm || ''}`);
              if (Array.isArray(tagsVal) && tagsVal.length) lines.push(`Tags: ${tagsVal.join(', ')}`);
              lines.push(`Health: ${r.healthScore ?? '-'} / 10 · ${r.calories ?? '—'} kcal · ${r.timeMinutes ?? '—'} min · ${r.country || ''}`);
              if (Array.isArray(ings) && ings.length) { lines.push('Ingredients:'); ings.forEach(i => lines.push(` - ${i.name}${i.quantity ? ` — ${i.quantity} ${i.unit || ''}` : ''}`)); }
              if (Array.isArray(optIngs) && optIngs.length) { lines.push('Optional:'); optIngs.forEach(i => lines.push(` - ${i.name}${i.quantity ? ` — ${i.quantity} ${i.unit || ''}` : ''}`)); }
              if (prepSimple) { lines.push('Preparation (Simple):'); lines.push(prepSimple); }
              if (prepAdv) { lines.push('Preparation (Advanced):'); lines.push(prepAdv); }
              if (chefTips) { lines.push('Chef Tips:'); lines.push(chefTips); }
              if (dietTips) { lines.push('Dietitian Tips:'); lines.push(dietTips); }
              lines.push('');
            });
            const text = lines.join('\n');
            try { await navigator.clipboard.writeText(text); } catch {}
            if (navigator.canShare && navigator.share) navigator.share({ text, title: 'Recipes' }).catch(() => {});
            setToastMsg(t('Copied to clipboard'));
          } }, h('span', { className: 'ic share' }), ' ', t('Copy recipe(s) to clipboard'))
        ),
        h('div', { className: 'share-card' },
          h('div', { style: { fontWeight: 700 } }, t('Copy ingredients to clipboard')),
          h('div', { className: 'muted' }, t('Copies all ingredients of the selected recipes to the clipboard, separated as Main and Optional ingredients.')),
          h('button', { className: 'btn sm icon', onClick: async () => {
            const mainSet = new Set(); const optSet = new Set();
            shareRecipes.forEach(r => {
              const { value: ings } = getLangField(r, 'ingredients');
              const { value: optIngs } = getLangField(r, 'optionalIngredients');
              (Array.isArray(ings) ? ings : []).forEach(i => { if (i?.name) mainSet.add(i.name); });
              (Array.isArray(optIngs) ? optIngs : []).forEach(i => { if (i?.name) optSet.add(i.name); });
            });
            const lines = ['Main ingredients:', ...Array.from(mainSet).sort().map(n => ` - ${n}`), '', 'Optional ingredients:', ...Array.from(optSet).sort().map(n => ` - ${n}`)];
            const text = lines.join('\n');
            try { await navigator.clipboard.writeText(text); } catch {}
            if (navigator.canShare && navigator.share) navigator.share({ text, title: 'Recipes' }).catch(() => {});
            setToastMsg(t('Copied to clipboard'));
          } }, h('span', { className: 'ic share' }), ' ', t('Copy ingredients to clipboard'))
        )
      )
    )
  );

  return h(Fragment, null,
    currentPage === 'list' && h(RecipeList, {
      recipes, visibleRecipes, selectedIds, selecting, searchQuery, setSearchQuery, openAdvanced,
      enterSelection, exitSelection, selectAllVisible, openShare, bulkDelete,
      FLAG, t, menuOpen, setMenuOpen, setLang, FLAG_EMOJI, deleteRecipe, openDetail, toggleSelected,
      DEFAULT_THUMB, getLangField, extractVideoId, activeFilterChips, onImport: handleImport, onExport: handleExport,
      openEditor, resetRecipes
    }),
    currentPage === 'advanced' && AdvancedPage,
    currentPage === 'detail' && detailRecipe && h(RecipeView, {
      recipe: detailRecipe, onBack: closeDetail, onEdit: openEditor, onShare: shareCurrentRecipe,
      t, FLAG, getLangField, extractVideoId, DEFAULT_THUMB
    }),
    currentPage === 'editor' && editingRecipe && h(RecipeEditor, {
      recipe: editingRecipe, isCreate, onCancel: closeEditor, onSave: saveEditedRecipe,
      t, LANGS, FLAG, collectCountries
    }),
    currentPage === 'share' && SharePage,
    h('div', { className: toastMsg ? 'toast show' : 'toast' }, toastMsg)
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));

export default App;
