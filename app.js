// App entry: global state, translations, utils, advanced/share pages; renders child components via React.createElement.

import { RecipeList } from './RecipeList.js';
import { RecipeView } from './RecipeView.js';
import { RecipeEditor } from './RecipeEditor.js';
import { importAppStateFromFile, exportAppStateToFile } from './ImportExport.js';
import { initFirebase, ensureSignedIn, saveRemoteState, loadRemoteState } from './firebase.js';

const { useState, useEffect, useMemo, useCallback, Fragment } = React;
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
    "Search recipes…": "Search recipes…","Find easy, healthy recipes for every day": "Find easy, healthy recipes for every day",
    "Simply Healthy": "Simply Healthy","Advanced": "Advanced","Select": "Select","Cancel Select": "Cancel Select",
    "Select All": "Select All","Share": "Share","Delete": "Delete","Saved": "Filtered recipes saved","of": "of",
    "Advanced Search": "Advanced Filter","Filters": "Filters","Dietary Needs": "Dietary Needs","Cuisine": "Cuisine","Time to Cook": "Time to Cook","Preferences": "Preferences",
    "Simple": "Simple","Advanced": "Advanced","Meal (OR inside)": "Meal (OR inside)","Meal": "Meal","Diet": "Diet","Course": "Course",
    "Constraints": "Constraints","Minimum Health Rating": "Minimum Health Rating","Maximum Calories (kcal)": "Maximum Calories (kcal)",
    "Max Preparation Time (minutes)": "Max Preparation Time (minutes)","Countries": "Countries","Reset": "Reset","Apply": "Apply",
    "Back": "Back","View Mode": "View Mode","Tags": "Tags","Info": "Info","Ingredients": "Ingredients","Preparation": "Preparation",
    "Optional / Enrichment": "Optional / Enrichment","Preparation — Advanced": "Preparation — Advanced","Chef Tips": "Chef Tips",
    "Dietitian Tips & Macros": "Dietitian Tips & Macros","Videos": "Videos","Switch to Advanced": "Switch to Advanced",
    "Switch to Simple": "Switch to Simple","View": "View","View recipe": "View recipe","Edit": "Edit","Name": "Name","Country": "Country","Meal Tags": "Meal Tags",
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
    "Cream-Soup": "Cream-Soup","Smoothy": "Smoothy",
    "Favorite": "Favorite","Add to Favorite": "Add to Favorite","Remove from Favorites": "Remove from Favorites",
  "Show favorites": "Show favorites","Show all": "Show all",
  "Save to Firebase": "Save to Firebase","Import from Firebase": "Import from Firebase",
  "Saved to Firebase": "Saved to Firebase","Imported from Firebase": "Imported from Firebase",
  "No data in Firebase": "No data in Firebase"
  },
  es: {
    "Add": "Añadir","Import": "Importar","Export": "Exportar","Reset (forget recipes)": "Restablecer (olvidar recetas)",
    "Search recipes…": "Buscar recetas…","Find easy, healthy recipes for every day": "Encuentra recetas fáciles y saludables para cada día",
    "Simply Healthy": "Simplemente Saludable","Advanced": "Avanzado","Select": "Seleccionar","Cancel Select": "Cancelar selección",
    "Select All": "Seleccionar todo","Share": "Compartir","Delete": "Eliminar","Saved": "Recetas filtradas guardadas","of": "de",
    "Advanced Search": "Filtro avanzada","Filters": "Filtros","Dietary Needs": "Necesidades dietéticas","Cuisine": "Cocina","Time to Cook": "Tiempo de cocción","Preferences": "Preferencias",
    "Simple": "Simple","Advanced": "Avanzado","Meal (OR inside)": "Comida (OR dentro)","Meal": "Comida","Diet": "Dieta","Course": "Curso",
    "Constraints": "Restricciones","Minimum Health Rating": "Puntuación mínima de salud","Maximum Calories (kcal)": "Calorías máximas (kcal)",
    "Max Preparation Time (minutes)": "Tiempo máximo de preparación (minutos)","Countries": "Países","Reset": "Restablecer","Apply": "Aplicar",
    "Back": "Atrás","View Mode": "Modo de vista","Tags": "Etiquetas","Info": "Información","Ingredients": "Ingredientes","Preparation": "Preparación",
    "Optional / Enrichment": "Opcional / Enriquecimiento","Preparation — Advanced": "Preparación — Avanzada","Chef Tips": "Consejos del chef",
    "Dietitian Tips & Macros": "Consejos del dietista y macros","Videos": "Videos","Switch to Advanced": "Cambiar a avanzado",
    "Switch to Simple": "Cambiar a simple","View": "Ver","View recipe": "Ver receta","Edit": "Editar","Name": "Nombre","Country": "País","Meal Tags": "Etiquetas de comida",
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
    "Dessert": "Postre","Juice": "Jugo","Cream-Soup": "Crema","Smoothy": "Batido",
    "Favorite": "Favorito","Add to Favorite": "Añadir a favorito","Remove from Favorites": "Quitar de favoritos",
  "Show favorites": "Ver favoritos","Show all": "Ver todos",
  "Save to Firebase": "Guardar en Firebase","Import from Firebase": "Importar desde Firebase",
  "Saved to Firebase": "Guardado en Firebase","Imported from Firebase": "Importado desde Firebase",
  "No data in Firebase": "Sin datos en Firebase"
  },
  de: {
    "Add": "Hinzufügen","Import": "Importieren","Export": "Exportieren","Reset (forget recipes)": "Zurücksetzen (Rezepte vergessen)",
    "Search recipes…": "Rezepte suchen…","Find easy, healthy recipes for every day": "Finde einfache, gesunde Rezepte für jeden Tag",
    "Simply Healthy": "Einfach Gesund","Advanced": "Erweitert","Select": "Auswählen","Cancel Select": "Auswahl abbrechen",
    "Select All": "Alle auswählen","Share": "Teilen","Delete": "Löschen","Saved": "Gespeicherte gefilterte Rezepte","of": "von",
    "Advanced Search": "Erweiterte Filter","Filters": "Filter","Dietary Needs": "Ernährungsbedürfnisse","Cuisine": "Küche","Time to Cook": "Kochzeit","Preferences": "Vorlieben",
    "Simple": "Einfach","Advanced": "Fortgeschritten","Meal (OR inside)": "Mahlzeit (ODER innen)","Meal": "Mahlzeit","Diet": "Ernährung","Course": "Gang",
    "Constraints": "Einschränkungen","Minimum Health Rating": "Mindestgesundheitsbewertung","Maximum Calories (kcal)": "Maximale Kalorien (kcal)",
    "Max Preparation Time (minutes)": "Maximale Zubereitungszeit (Minuten)","Countries": "Länder","Reset": "Zurücksetzen","Apply": "Anwenden",
    "Back": "Zurück","View Mode": "Ansicht","Tags": "Tags","Info": "Informationen","Ingredients": "Zutaten","Preparation": "Zubereitung",
    "Optional / Enrichment": "Optional / Anreicherung","Preparation — Advanced": "Zubereitung — Fortgeschritten","Chef Tips": "Chef-Tipps",
    "Dietitian Tips & Macros": "Ernährungsberater-Tipps & Makros","Videos": "Videos","Switch to Advanced": "Zu Erweitert wechseln",
    "Switch to Simple": "Zu Einfach wechseln","View": "Ansicht","View recipe": "Rezept ansehen","Edit": "Bearbeiten","Name": "Name","Country": "Land",
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
    "Dessert": "Dessert","Juice": "Saft","Cream-Soup": "Cremesuppe","Smoothy": "Smoothie",
    "Favorite": "Favorit","Add to Favorite": "Zu Favoriten hinzufügen","Remove from Favorites": "Aus Favoriten entfernen",
  "Show favorites": "Favoriten anzeigen","Show all": "Alle anzeigen",
  "Save to Firebase": "In Firebase speichern","Import from Firebase": "Aus Firebase importieren",
  "Saved to Firebase": "In Firebase gespeichert","Imported from Firebase": "Aus Firebase importiert",
  "No data in Firebase": "Keine Daten in Firebase"
  },
  fr: {
    "Add": "Ajouter","Import": "Importer","Export": "Exporter","Reset (forget recipes)": "Réinitialiser (oublier les recettes)",
    "Search recipes…": "Rechercher des recettes…","Find easy, healthy recipes for every day": "Trouvez des recettes faciles et saines pour chaque jour",
    "Simply Healthy": "Simplement Sain","Advanced": "Avancé","Select": "Sélectionner","Cancel Select": "Annuler la sélection",
    "Select All": "Tout sélectionner","Share": "Partager","Delete": "Supprimer","Saved": "Recettes filtrées enregistrées","of": "sur",
    "Advanced Search": "Recherche avancée","Filters": "Filtres","Dietary Needs": "Besoins diététiques","Cuisine": "Cuisine","Time to Cook": "Temps de cuisson","Preferences": "Préférences",
    "Simple": "Simple","Advanced": "Avancé","Meal (OR inside)": "Repas (OU à l'intérieur)","Meal": "Repas","Diet": "Régime","Course": "Cours",
    "Constraints": "Contraintes","Minimum Health Rating": "Note de santé minimale","Maximum Calories (kcal)": "Calories maximales (kcal)",
    "Max Preparation Time (minutes)": "Temps de préparation maximal (minutes)","Countries": "Pays","Reset": "Réinitialiser","Apply": "Appliquer",
    "Back": "Retour","View Mode": "Mode d'affichage","Tags": "Étiquettes","Info": "Infos","Ingredients": "Ingrédients","Preparation": "Préparation",
    "Optional / Enrichment": "Optionnel / Enrichissement","Preparation — Advanced": "Préparation — Avancée","Chef Tips": "Conseils du chef",
    "Dietitian Tips & Macros": "Conseils du diététiste & macros","Videos": "Vidéos","Switch to Advanced": "Passer en mode avancé",
    "Switch to Simple": "Passer en mode simple","View": "Voir","View recipe": "Voir la recette","Edit": "Modifier","Name": "Nom","Country": "Pays","Meal Tags": "Tags de repas",
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
    "Soup": "Soupe","Side": "Accompagnement","Starter": "Entrée","Dessert": "Dessert","Juice": "Jus","Cream-Soup": "Velouté","Smoothy": "Smoothie",
    "Favorite": "Favori","Add to Favorite": "Ajouter aux favoris","Remove from Favorites": "Retirer des favoris",
  "Show favorites": "Afficher favoris","Show all": "Afficher tout",
  "Save to Firebase": "Enregistrer sur Firebase","Import from Firebase": "Importer depuis Firebase",
  "Saved to Firebase": "Enregistré sur Firebase","Imported from Firebase": "Importé depuis Firebase",
  "No data in Firebase": "Aucune donnée sur Firebase"
  }
};

// Utils
const STORAGE_KEY = 'healthyRecipeAppState';
const APP_STATE_VERSION = 2;

function defaultAdvanced() {
  return { meal: [], diet: [], course: [], countries: [], minHealth: 1, maxKcal: null, maxTime: null };
}
function defaultAdvCollapse() {
  return { meal: true, diet: true, course: true, constraints: true, countries: true };
}
function buildDefaultAppState(overrides = {}) {
  return {
    version: APP_STATE_VERSION,
    recipes: [],
    searchQuery: '',
    advanced: defaultAdvanced(),
    favorites: [],
    favoritesOnly: false,
    lang: 'en',
    currentPage: 'list',
    detailRecipeId: null,
    editor: null,
    advCollapse: defaultAdvCollapse(),
    selecting: false,
    selectedIds: [],
    ...overrides
  };
}
function sanitizeArray(value) {
  return Array.isArray(value) ? [...value] : [];
}
function migrateAppState(raw) {
  const base = buildDefaultAppState();
  if (!raw || typeof raw !== 'object') return base;

  const advancedRaw = raw.advanced && typeof raw.advanced === 'object' ? raw.advanced : {};
  const advCollapseRaw = raw.advCollapse && typeof raw.advCollapse === 'object' ? raw.advCollapse : {};
  const editorRaw = raw.editor && typeof raw.editor === 'object' ? raw.editor : null;

  const migrated = {
    ...base,
    ...raw,
    version: APP_STATE_VERSION,
    advanced: {
      ...defaultAdvanced(),
      ...advancedRaw
    },
    advCollapse: {
      ...defaultAdvCollapse(),
      ...advCollapseRaw
    },
    favorites: sanitizeArray(raw.favorites),
    selectedIds: sanitizeArray(raw.selectedIds)
  };

  migrated.advanced.meal = sanitizeArray(migrated.advanced.meal);
  migrated.advanced.diet = sanitizeArray(migrated.advanced.diet);
  migrated.advanced.course = sanitizeArray(migrated.advanced.course);
  migrated.advanced.countries = sanitizeArray(migrated.advanced.countries);
  migrated.advanced.minHealth = typeof migrated.advanced.minHealth === 'number' ? migrated.advanced.minHealth : 1;
  migrated.advanced.maxKcal = migrated.advanced.maxKcal != null ? migrated.advanced.maxKcal : null;
  migrated.advanced.maxTime = migrated.advanced.maxTime != null ? migrated.advanced.maxTime : null;

  migrated.editor = editorRaw && editorRaw.draft && typeof editorRaw.draft === 'object'
    ? { isCreate: !!editorRaw.isCreate, draft: editorRaw.draft }
    : null;

  if (!LANGS.includes(migrated.lang)) migrated.lang = 'en';
  migrated.favoritesOnly = !!migrated.favoritesOnly;
  migrated.selecting = !!migrated.selecting;

  return migrated;
}
function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return migrateAppState(JSON.parse(raw));
  } catch (err) {
    console.warn('Failed to load stored state', err);
  }
  try {
    const legacy = JSON.parse(localStorage.getItem('recipes') || '[]');
    if (Array.isArray(legacy)) return migrateAppState({ recipes: legacy });
  } catch (err) {
    console.warn('Failed to load legacy recipes', err);
  }
  return buildDefaultAppState();
}
function saveAppState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.removeItem('recipes');
  } catch (err) {
    console.warn('Failed to persist state', err);
  }
}
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
  useEffect(() => { try { initFirebase(); } catch {} }, []);
  const initialState = useMemo(() => loadAppState(), []);
  const normalizedSeed = useMemo(
    () => (initialState.recipes || []).map(normalizeRecipe),
    [initialState]
  );
  const initialIdSet = useMemo(
    () => new Set(normalizedSeed.map(r => r.id).filter(Boolean)),
    [normalizedSeed]
  );
  const initialDetailRecipe = useMemo(
    () => (initialState.detailRecipeId ? normalizedSeed.find(r => r.id === initialState.detailRecipeId) || null : null),
    [normalizedSeed, initialState]
  );
  const initialEditorDraft = useMemo(() => {
    const editor = initialState.editor;
    if (editor && editor.draft && typeof editor.draft === 'object') {
      return JSON.parse(JSON.stringify(editor.draft));
    }
    return null;
  }, [initialState]);
  const initialPage = useMemo(() => {
    let page = initialState.currentPage;
    if (page === 'detail' && !initialDetailRecipe) page = 'list';
    if (page === 'editor' && !initialEditorDraft) page = 'list';
    if (page === 'share') page = 'list';
    if (!['list', 'detail', 'advanced', 'editor'].includes(page)) page = 'list';
    return page;
  }, [initialState, initialDetailRecipe, initialEditorDraft]);

  const [recipes, setRecipes] = useState(normalizedSeed);
  const [searchQuery, setSearchQuery] = useState(initialState.searchQuery || '');
  const [advanced, setAdvanced] = useState(() => ({
    meal: new Set(sanitizeArray(initialState.advanced?.meal)),
    diet: new Set(sanitizeArray(initialState.advanced?.diet)),
    course: new Set(sanitizeArray(initialState.advanced?.course)),
    countries: new Set(sanitizeArray(initialState.advanced?.countries)),
    minHealth: initialState.advanced?.minHealth ?? 1,
    maxKcal: initialState.advanced?.maxKcal ?? null,
    maxTime: initialState.advanced?.maxTime ?? null
  }));
  const [selecting, setSelecting] = useState(() => !!initialState.selecting && sanitizeArray(initialState.selectedIds).length > 0);
  const [selectedIds, setSelectedIds] = useState(() => new Set(sanitizeArray(initialState.selectedIds).filter(id => initialIdSet.has(id))));
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [detailRecipe, setDetailRecipe] = useState(() => (initialPage === 'detail' ? initialDetailRecipe : null));
  const [editingRecipe, setEditingRecipe] = useState(() => (initialPage === 'editor' ? initialEditorDraft : null));
  const [isCreate, setIsCreate] = useState(() => (initialPage === 'editor' && initialState.editor ? !!initialState.editor.isCreate : false));
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareRecipes, setShareRecipes] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const [lang, setLang] = useState(() => (LANGS.includes(initialState.lang) ? initialState.lang : 'en'));
  const [advCollapse, setAdvCollapse] = useState(() => ({ ...defaultAdvCollapse(), ...(initialState.advCollapse || {}) }));
  const [favoritesOnly, setFavoritesOnly] = useState(!!initialState.favoritesOnly);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const pref = new Set(sanitizeArray(initialState.favorites).filter(id => initialIdSet.has(id)));
    if (pref.size === 0) {
      normalizedSeed.forEach(r => {
        if (Array.isArray(r.tags) && r.tags.some(t => (t ?? '').toLowerCase() === 'favorite')) pref.add(r.id);
      });
    }
    return pref;
  });

  // Seed (note: some preview servers block file:// fetch; use http if needed)
  useEffect(() => {
    if ((initialState.recipes || []).length > 0) return;
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
        const seeded = Array.from(map.values());
        setRecipes(seeded);
        setFavoriteIds(prev => {
          if (prev.size > 0) return prev;
          const seededFavs = seeded
            .filter(r => Array.isArray(r.tags) && r.tags.some(t => (t ?? '').toLowerCase() === 'favorite'))
            .map(r => r.id);
          if (seededFavs.length === 0) return prev;
          return new Set(seededFavs);
        });
      } catch (err) { console.warn('Default seed load failed:', err); }
    })();
  }, [initialState]);

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
  // ADD: favorite helper (checks both base tags and i18n tags)
  const isFavorite = r => {
    if (favoriteIds.has(r.id)) return true;
    const base = Array.isArray(r.tags) ? r.tags : [];
    const { value: locTags } = getLangField(r, 'tags') || { value: [] };
    const all = [...base, ...(Array.isArray(locTags) ? locTags : [])]
      .map(x => (x ?? '').toString().toLowerCase());
    return all.includes('favorite');
  };

  const searchPredicate = useMemo(() => buildLangSearchPredicate(searchQuery, getLangField), [searchQuery, lang]);

  const matchesAdvanced = r => {
    if ((r.healthScore || 0) < (advanced.minHealth || 1)) return false;
    if (advanced.maxKcal != null && (r.calories || 0) > advanced.maxKcal) return false;
    if (advanced.maxTime != null && (r.timeMinutes || 9999) > advanced.maxTime) return false;
    if (advanced.meal.size) { const tags = r.tags || []; if (![...advanced.meal].some(tag => tags.includes(tag))) return false; }
    // OR inside Diet (changed from AND)
    if (advanced.diet.size) { const tags = r.tags || []; if (![...advanced.diet].some(tag => tags.includes(tag))) return false; }
    // OR inside Course (changed from AND)
    if (advanced.course.size) { const tags = r.tags || []; if (![...advanced.course].some(tag => tags.includes(tag))) return false; }
    if (advanced.countries.size && !advanced.countries.has(r.country)) return false;
    return true;
  };

  // existing memo of visible recipes — extend with favoritesOnly
  // BEFORE:
  // const visibleRecipes = useMemo(() => recipes.filter(r => searchPredicate(r) && matchesAdvanced(r)), [recipes, searchPredicate, advanced]);
  // AFTER:
  const visibleRecipes = useMemo(
    () => recipes.filter(r =>
      searchPredicate(r) &&
      matchesAdvanced(r) &&
      (!favoritesOnly || isFavorite(r))
    ),
    [recipes, searchPredicate, advanced, favoritesOnly, favoriteIds]
  );

  useEffect(() => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      for (const id of prev) if (!visibleRecipes.some(r => r.id === id)) next.delete(id);
      return next;
    });
  }, [visibleRecipes]);

  useEffect(() => {
    setFavoriteIds(prev => {
      const valid = new Set(recipes.map(r => r.id));
      const filtered = Array.from(prev).filter(id => valid.has(id));
      if (filtered.length === prev.size) return prev;
      return new Set(filtered);
    });
  }, [recipes]);

  useEffect(() => {
    if (!detailRecipe) return;
    const latest = recipes.find(r => r.id === detailRecipe.id);
    if (!latest) {
      setDetailRecipe(null);
      if (currentPage === 'detail') setCurrentPage('list');
      return;
    }
    if (latest !== detailRecipe) setDetailRecipe(latest);
  }, [recipes, detailRecipe, currentPage]);

  const applyHydratedState = useCallback((incoming) => {
    const sanitized = migrateAppState(incoming);
    const normalized = (sanitized.recipes || []).map(normalizeRecipe);
    const validIds = new Set(normalized.map(r => r.id));

    setRecipes(normalized);
    setSearchQuery(sanitized.searchQuery || '');
    setAdvanced({
      meal: new Set(sanitizeArray(sanitized.advanced.meal)),
      diet: new Set(sanitizeArray(sanitized.advanced.diet)),
      course: new Set(sanitizeArray(sanitized.advanced.course)),
      countries: new Set(sanitizeArray(sanitized.advanced.countries)),
      minHealth: sanitized.advanced.minHealth ?? 1,
      maxKcal: sanitized.advanced.maxKcal ?? null,
      maxTime: sanitized.advanced.maxTime ?? null
    });
    setLang(LANGS.includes(sanitized.lang) ? sanitized.lang : 'en');
    setFavoritesOnly(!!sanitized.favoritesOnly);

    const favIds = sanitizeArray(sanitized.favorites).filter(id => validIds.has(id));
    if (favIds.length === 0) {
      normalized.forEach(r => {
        if (Array.isArray(r.tags) && r.tags.some(t => (t ?? '').toLowerCase() === 'favorite')) favIds.push(r.id);
      });
    }
    setFavoriteIds(new Set(favIds));

    const detail = sanitized.detailRecipeId ? normalized.find(r => r.id === sanitized.detailRecipeId) || null : null;
    setDetailRecipe(detail);

    const selected = sanitizeArray(sanitized.selectedIds).filter(id => validIds.has(id));
    setSelectedIds(new Set(selected));
    setSelecting(!!sanitized.selecting && selected.length > 0);
    setAdvCollapse({ ...defaultAdvCollapse(), ...(sanitized.advCollapse || {}) });

    let nextPage = sanitized.currentPage;
    if (nextPage === 'detail' && !detail) nextPage = 'list';

    let editorDraft = null;
    let editorCreate = false;
    if (sanitized.editor && sanitized.editor.draft && typeof sanitized.editor.draft === 'object') {
      editorDraft = JSON.parse(JSON.stringify(sanitized.editor.draft));
      editorCreate = !!sanitized.editor.isCreate;
    }
    if (nextPage === 'editor') {
      if (!editorDraft) nextPage = 'list';
    } else {
      editorDraft = null;
      editorCreate = false;
    }
    if (nextPage === 'share') nextPage = 'list';
    if (!['list', 'detail', 'advanced', 'editor'].includes(nextPage)) nextPage = 'list';

    setEditingRecipe(editorDraft);
    setIsCreate(editorCreate);
    setCurrentPage(nextPage);
    setMenuOpen(false);
    setShareRecipes([]);
    setToastMsg(null);
  }, []);

  const collectCountries = useMemo(() => {
    const base = [
      'USA','UK','Canada','France','Netherlands','Spain','Germany','Italy','China','Japan','Thailand','Vietnam',
      'Peru','Mexico','Argentina','Chile','Colombia','Ecuador','Venezuela','Uruguay','Paraguay','Bolivia','Brazil',
      'Sweden','Norway','Denmark','Finland'
    ];
    const have = Array.from(new Set(recipes.map(r => r.country).filter(Boolean)));
    return Array.from(new Set([...have, ...base])).sort();
  }, [recipes]);

  const serializableState = useMemo(() => {
    const detailId = detailRecipe?.id || null;
    const editorPayload = editingRecipe ? { isCreate, draft: editingRecipe } : null;
    let page = currentPage;
    if (page === 'detail' && !detailId) page = 'list';
    if (page === 'editor' && !editorPayload) page = 'list';
    if (page === 'share') page = 'list';
    if (!['list', 'detail', 'advanced', 'editor'].includes(page)) page = 'list';
    return {
      version: APP_STATE_VERSION,
      recipes,
      searchQuery,
      advanced: {
        meal: Array.from(advanced.meal),
        diet: Array.from(advanced.diet),
        course: Array.from(advanced.course),
        countries: Array.from(advanced.countries),
        minHealth: advanced.minHealth ?? 1,
        maxKcal: advanced.maxKcal ?? null,
        maxTime: advanced.maxTime ?? null
      },
      favorites: Array.from(favoriteIds),
      favoritesOnly,
      lang,
      currentPage: page,
      detailRecipeId: detailId,
      editor: editorPayload,
      advCollapse,
      selecting,
      selectedIds: Array.from(selectedIds)
    };
  }, [recipes, searchQuery, advanced, favoriteIds, favoritesOnly, lang, currentPage, detailRecipe, editingRecipe, isCreate, advCollapse, selecting, selectedIds]);

  useEffect(() => {
    saveAppState(serializableState);
  }, [serializableState]);

  // Chips
  const activeFilterChips = [];
  if (advanced.meal.size) for (const m of advanced.meal) activeFilterChips.push({ label: m, onRemove: () => setAdvanced(p => ({ ...p, meal: new Set([...p.meal].filter(x => x !== m)) })) });
  if (advanced.diet.size) for (const d of advanced.diet) activeFilterChips.push({ label: d, onRemove: () => setAdvanced(p => ({ ...p, diet: new Set([...p.diet].filter(x => x !== d)) })) });
  if (advanced.course.size) for (const c of advanced.course) activeFilterChips.push({ label: c, onRemove: () => setAdvanced(p => ({ ...p, course: new Set([...p.course].filter(x => x !== c)) })) });
  if (advanced.countries.size) for (const ct of advanced.countries) activeFilterChips.push({ label: ct, onRemove: () => setAdvanced(p => ({ ...p, countries: new Set([...p.countries].filter(x => x !== ct)) })) });
  if (advanced.minHealth && advanced.minHealth > 1) activeFilterChips.push({ label: `Health ≥ ${advanced.minHealth}`, onRemove: () => setAdvanced(p => ({ ...p, minHealth: 1 })) });
  if (advanced.maxKcal != null) activeFilterChips.push({ label: `Kcal ≤ ${advanced.maxKcal}`, onRemove: () => setAdvanced(p => ({ ...p, maxKcal: null })) });
  if (advanced.maxTime != null) activeFilterChips.push({ label: `Time ≤ ${advanced.maxTime}m`, onRemove: () => setAdvanced(p => ({ ...p, maxTime: null })) });
  // OPTIONAL: show a chip when favoritesOnly is on, removable
  if (favoritesOnly) {
    activeFilterChips.push({
      label: '❤️ Favorite',
      onRemove: () => setFavoritesOnly(false)
    });
  }

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
  const closeEditor = () => { setEditingRecipe(null); setIsCreate(false); setCurrentPage('list'); };
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
      setRecipes(prev => [edited, ...prev]);
    } else {
      const targetId = editingRecipe?.id;
      setRecipes(prev => prev.map(r => (r.id === targetId ? edited : r)));
    }
    closeEditor(); setDetailRecipe(edited); setCurrentPage('detail');
  };

  // Selection
  const enterSelection = () => { setSelecting(true); setSelectedIds(new Set()); };
  const exitSelection = () => { setSelecting(false); setSelectedIds(new Set()); };
  const toggleSelected = id => setSelectedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const selectAllVisible = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      visibleRecipes.forEach(r => next.add(r.id));
      return next;
    });
  };
  const bulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} selected recipe(s)?`)) return;
    const idsToRemove = new Set(selectedIds);
    setRecipes(prev => prev.filter(r => !idsToRemove.has(r.id)));
    setFavoriteIds(prev => {
      let changed = false;
      const next = new Set(prev);
      idsToRemove.forEach(id => { if (next.delete(id)) changed = true; });
      return changed ? next : prev;
    });
    setSelectedIds(new Set());
    setSelecting(false);
    if (detailRecipe && idsToRemove.has(detailRecipe.id)) {
      setDetailRecipe(null);
      if (currentPage === 'detail') setCurrentPage('list');
    }
  };
  const deleteRecipe = id => {
    if (!window.confirm('Delete this recipe?')) return;
    setRecipes(prev => prev.filter(r => r.id !== id));
    setFavoriteIds(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setSelectedIds(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (detailRecipe && detailRecipe.id === id) {
      setDetailRecipe(null);
      if (currentPage === 'detail') setCurrentPage('list');
    }
  };

  // Favorites: toggle filter and toggle favorite tag on a recipe
  const toggleFavoritesOnly = () => setFavoritesOnly(v => !v);
  const toggleFavorite = id => {
    const makeFavorite = !favoriteIds.has(id);
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (makeFavorite) next.add(id); else next.delete(id);
      return next;
    });
    setRecipes(prev => prev.map(r => {
      if (r.id !== id) return r;
      const base = Array.isArray(r.tags) ? r.tags : [];
      const hasTag = base.some(tg => (tg ?? '').toLowerCase() === 'favorite');
      if (makeFavorite && !hasTag) return { ...r, tags: [...base, 'favorite'] };
      if (!makeFavorite && hasTag) return { ...r, tags: base.filter(tg => (tg ?? '').toLowerCase() !== 'favorite') };
      return r;
    }));
    setDetailRecipe(prev => {
      if (!prev || prev.id !== id) return prev;
      const base = Array.isArray(prev.tags) ? prev.tags : [];
      const hasTag = base.some(tg => (tg ?? '').toLowerCase() === 'favorite');
      if (makeFavorite && !hasTag) return { ...prev, tags: [...base, 'favorite'] };
      if (!makeFavorite && hasTag) return { ...prev, tags: base.filter(tg => (tg ?? '').toLowerCase() !== 'favorite') };
      return prev;
    });
  };

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
      const payload = await importAppStateFromFile(file);
      applyHydratedState(payload);
    } catch (err) { alert('Import failed: ' + err.message); }
  };
  const handleExport = () => exportAppStateToFile(serializableState);
  const resetRecipes = () => {
    if (!window.confirm('This will remove all saved recipes from this browser. Continue?')) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('recipes');
    applyHydratedState(buildDefaultAppState());
  };

  // Cloud actions (Firebase)
  const saveToFirebase = async () => {
    try {
      const user = await ensureSignedIn();
      await saveRemoteState(user.uid, serializableState);
      setToastMsg(t('Saved to Firebase'));
    } catch (err) {
      alert('Cloud save failed: ' + (err.message || err));
    } finally {
      setMenuOpen(false);
    }
  };
  const importFromFirebase = async () => {
    try {
      const user = await ensureSignedIn();
      const res = await loadRemoteState(user.uid);
      if (res && res.state) {
        applyHydratedState(res.state);
        setToastMsg(t('Imported from Firebase'));
      } else {
        setToastMsg(t('No data in Firebase'));
      }
    } catch (err) {
      alert('Cloud import failed: ' + (err.message || err));
    } finally {
      setMenuOpen(false);
    }
  };

  // Advanced page
  const AdvancedPage = h('section', { className: 'page page-advanced', style: { display: 'block' }, id: 'pageAdvanced' },
    h('header', { className: 'page-header filter' },
      h('button', { className: 'page-link', onClick: closeAdvanced }, t('Back')),
      h('div', { className: 'page-title-group' },
        h('h2', { className: 'page-title' }, t('Advanced Search')),
        h('p', { className: 'page-subtitle' }, t('Filters'))
      ),
      h('button', { className: 'icon-btn close', onClick: closeAdvanced, 'aria-label': t('Back') }, '✕')
    ),
    h('div', { className: 'wrap' },
      h('div', { className: 'adv-stack' },
        h('section', { className: 'adv-card range-card' },
          h('h3', null, t('Preferences')),
          h('div', { className: 'range-stack' },
            h('label', null, t('Minimum Health Rating'), h('span', { className: 'range-value' }, `${advanced.minHealth}/10`)),
            h('input', { type: 'range', min: 1, max: 10, step: 1, value: advanced.minHealth, onChange: e => setAdvanced(p => ({ ...p, minHealth: parseInt(e.target.value, 10) })) }),
            h('label', null, t('Maximum Calories (kcal)'), h('span', { className: 'range-value' }, advanced.maxKcal != null ? advanced.maxKcal : '—')),
            h('input', { type: 'range', min: 0, max: 3000, step: 10, value: advanced.maxKcal != null ? advanced.maxKcal : 0, onChange: e => setAdvanced(p => ({ ...p, maxKcal: parseInt(e.target.value, 10) })) }),
            h('input', { type: 'number', min: 0, max: 3000, step: 10, value: advanced.maxKcal != null ? advanced.maxKcal : '', onChange: e => setAdvanced(p => ({ ...p, maxKcal: e.target.value.trim() === '' ? null : parseInt(e.target.value, 10) })) }),
            h('label', null, t('Max Preparation Time (minutes)'), h('span', { className: 'range-value' }, advanced.maxTime != null ? advanced.maxTime : '—')),
            h('input', { type: 'range', min: 0, max: 180, step: 5, value: advanced.maxTime != null ? advanced.maxTime : 0, onChange: e => setAdvanced(p => ({ ...p, maxTime: parseInt(e.target.value, 10) })) }),
            h('input', { type: 'number', min: 0, max: 180, step: 5, value: advanced.maxTime != null ? advanced.maxTime : '', onChange: e => setAdvanced(p => ({ ...p, maxTime: e.target.value.trim() === '' ? null : parseInt(e.target.value, 10) })) })
          )
        ),
        h('section', { className: 'adv-card' },
          h('h3', null, t('Meal')),
          h('div', { className: 'state-list pill' },
            MEAL.map(m => h('button', {
              key: m,
              className: 'state-chip' + (advanced.meal.has(m) ? ' on' : ''),
              onClick: () => toggleFilterSet('meal', m)
            }, t(m)))
          ),
          h('div', { className: 'divider soft' }),
          h('h3', null, t('Course')),
          h('div', { className: 'state-list pill' },
            COURSE.map(c => h('button', {
              key: c,
              className: 'state-chip' + (advanced.course.has(c) ? ' on' : ''),
              onClick: () => toggleFilterSet('course', c)
            }, t(c)))
          )
        ),
        h('section', { className: 'adv-card' },
          h('h3', null, t('Dietary Needs')),
          h('div', { className: 'state-list pill' },
            [...new Set(DIET)].map(d => h('button', {
              key: d,
              className: 'state-chip' + (advanced.diet.has(d) ? ' on' : ''),
              onClick: () => toggleFilterSet('diet', d)
            }, t(d)))
          )
        ),
        h('section', { className: 'adv-card' },
          h('h3', null, t('Cuisine')),
          h('div', { className: 'state-list pill' },
            collectCountries.map(cty => h('button', {
              key: cty,
              className: 'state-chip flag' + (advanced.countries.has(cty) ? ' on' : ''),
              onClick: () => toggleCountry(cty)
            }, h('span', { className: 'flag' }, FLAG[cty] || '🏳️'), ' ', cty))
          )
        )
      )
    ),
    h('footer', { className: 'page-footer filter' },
      h('button', { className: 'btn ghost', onClick: () => { clearAdvanced(); closeAdvanced(); } }, t('Reset')),
      h('button', { className: 'btn primary wide', onClick: applyAdvanced }, t('Apply'))
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
      openEditor, resetRecipes,
      // ADD:
      favoritesOnly,
      toggleFavorites: toggleFavoritesOnly,
      favoriteIds,
      cloudSave: saveToFirebase,
      cloudImport: importFromFirebase
    }),
    currentPage === 'advanced' && AdvancedPage,
    currentPage === 'detail' && detailRecipe && h(RecipeView, {
      recipe: detailRecipe, onBack: closeDetail, onEdit: openEditor, onShare: shareCurrentRecipe,
      t, FLAG, getLangField, extractVideoId, DEFAULT_THUMB,
      // ADD:
      onToggleFavorite: toggleFavorite,
      favoriteIds
    }),
    currentPage === 'editor' && editingRecipe && h(RecipeEditor, {
      recipe: editingRecipe, isCreate, onCancel: closeEditor, onSave: saveEditedRecipe,
      t, LANGS, FLAG, collectCountries,
      onDraftChange: setEditingRecipe
    }),
    currentPage === 'share' && SharePage,
    h('div', { className: toastMsg ? 'toast show' : 'toast' }, toastMsg)
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));

export default App;
