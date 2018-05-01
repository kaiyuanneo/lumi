// Auth actions
export const ACTION_SAVE_IS_SIGNED_IN = 'SAVE_IS_SIGNED_IN';
export const ACTION_SAVE_AUTH_USER_FIRST_NAME = 'SAVE_AUTH_USER_FIRST_NAME';
// Home actions
export const ACTION_SAVE_IS_AUTH_USER_IN_GROUP = 'SAVE_IS_AUTH_USER_IN_GROUP';
export const ACTION_SAVE_CURRENT_PRODUCT_CODE = 'SAVE_CURRENT_PRODUCT_CODE';
export const ACTION_SAVE_AUTH_USER_GROUP_INFO = 'SAVE_AUTH_USER_GROUP_INFO';
export const ACTION_SAVE_WINDOW_WIDTH = 'SAVE_WINDOW_WIDTH';
// Group actions
export const ACTION_SAVE_GROUP_ID_FIELD_VALUE = 'SAVE_GROUP_ID_FIELD_VALUE';
export const ACTION_SAVE_GROUP_JOIN_VALIDATION_STATE = 'SAVE_GROUP_JOIN_VALIDATION_STATE';
export const ACTION_SAVE_GROUP_NAME_FIELD_VALUE = 'SAVE_GROUP_NAME_FIELD_VALUE';
// CareProfile actions
export const ACTION_TOGGLE_FETCHED_CARE_RECIPIENT = 'TOGGLE_FETCHED_CARE_RECIPIENT';
export const ACTION_SAVE_CARE_RECIPIENT_UID = 'SAVE_CARE_RECIPIENT_UID';
export const ACTION_UPDATE_CARE_RECIPIENT = 'UPDATE_CARE_RECIPIENT';
export const ACTION_SAVE_CARE_PROFILE_FIELD_VALUE_LOCALLY = 'SAVE_CARE_PROFILE_FIELD_VALUE_LOCALLY';
export const ACTION_SAVE_CARE_PROFILE_FIELD_IS_IN_EDIT_MODE = 'SAVE_CARE_PROFILE_FIELD_IS_IN_EDIT_MODE';
export const ACTION_UNMOUNT_CARE_PROFILE_NEW_MEMBER_FORM = 'UNMOUNT_CARE_PROFILE_NEW_MEMBER_FORM';
export const ACTION_UPDATE_SELECT_CR_SELECTED_MEMBER = 'UPDATE_SELECT_CR_SELECTED_MEMBER';
export const ACTION_TOGGLE_SELECT_CR_USER_CLICKED_SELECT = 'UPDATE_SELECT_CR_USER_CLICKED_SELECT';
export const ACTION_UPDATE_SELECT_CR_GROUP_MEMBERS = 'FETCH_UPDATE_CR_GROUP_MEMBERS';
// Timeline actions
export const ACTION_SAVE_TIMELINE_MESSAGE = 'SAVE_TIMELINE_MESSAGE';
export const ACTION_DELETE_TIMELINE_MESSAGE = 'DELETE_TIMELINE_MESSAGE';
export const ACTION_SAVE_TIMELINE_FILTER_CATEGORIES = 'SAVE_TIMELINE_FILTER_CATEGORIES';
export const ACTION_TOGGLE_TIMELINE_FILTER_BUTTONS = 'TOGGLE_TIMELINE_FILTER_BUTTONS';
export const ACTION_SAVE_NUM_MESSAGES = 'SAVE_NUM_MESSAGES';

export const BOOTSTRAP_CSS_URL =
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css';
export const BOOTSTRAP_CSS_HASH =
  'sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u';

export const BUTTON_TEXT_CANCEL = 'Cancel';
export const BUTTON_TEXT_EDIT = 'Edit';
export const BUTTON_TEXT_SAVE = 'Save';
export const BUTTON_TEXT_SELECT = 'Select';

// Use the US date format to be consistent with Facebook
export const US_DATE_FORMAT = 'MM/DD/YYYY';

export const DB_EVENT_NAME_CHILD_ADDED = 'child_added';
export const DB_EVENT_NAME_CHILD_CHANGED = 'child_changed';
export const DB_EVENT_NAME_CHILD_REMOVED = 'child_removed';
export const DB_EVENT_NAME_VALUE = 'value';

export const DB_PATH_LUMI_GROUPS = 'lumi-groups';
export const DB_PATH_LUMI_MESSAGES = 'lumi-messages';
export const DB_PATH_LUMI_MESSAGES_GROUP = 'lumi-messages-group';
export const DB_PATH_LUMI_MESSAGES_USER = 'lumi-messages-user';
export const DB_PATH_USER_EMAIL_TO_UID = 'user-email-to-uid';
export const DB_PATH_USER_PSID_TO_UID = 'user-psid-to-uid';
export const DB_PATH_USERS = 'users';

export const FIREBASE_API_KEY = 'AIzaSyAbxVPlyTTq2AITU-fakTFU7ZiGUQRmG00';
export const FIREBASE_AUTH_DOMAIN = 'lumi-cares.firebaseapp.com';
export const FIREBASE_DATABASE_URL = 'https://lumi-cares.firebaseio.com';
export const FIREBASE_STORAGE_BUCKET = 'lumi-cares.appspot.com';

export const FORM_VALIDATION_SUCCESS = 'success';
export const FORM_VALIDATION_ERROR = 'error';

export const GROUP_CREATE_TITLE = 'Create New Group';
export const GROUP_CREATE_BUTTON_TEXT = 'Create Group';
export const GROUP_JOIN_TITLE = 'Join Existing Group';
export const GROUP_JOIN_BUTTON_TEXT = 'Join Group';
export const GROUP_ID_FIELD_PLACEHOLDER = 'Enter Lumi Group ID';
export const GROUP_ID_FIELD_PROMPT = 'Join an existing Lumi Group';
export const GROUP_ID_FIELD_HELP = 'This ID must be a valid group ID of an existing Lumi Group';
export const GROUP_NAME_FIELD_PLACEHOLDER = 'Enter new group name';
export const GROUP_NAME_FIELD_PROMPT = 'Choose a group name for your new group';
export const GROUP_NAME_FIELD_HELP =
  'Lumi will generate a Group ID to share with family and friends on the next page';

export const NAVBAR_HEADER_TITLE = 'Lumi';
export const NAVBAR_ICON_SIZE = 24;
export const NAVBAR_ITEM_TIMELINE = 'Timeline';
export const NAVBAR_ITEM_ADD_MEMORY = 'Add';
export const NAVBAR_ITEM_SUMMARY = 'Summary';
export const NAVBAR_ITEM_CARE_PROFILE = 'Profile';
export const NAVBAR_ITEM_GROUP_ID = 'Group ID: ';
export const NAVBAR_ITEM_SIGN_OUT = 'Sign Out';

export const NEW_USER_PAGE_TITLE = 'Welcome to Lumi, ';
export const NEW_USER_PAGE_SUBTITLE =
  'Before we begin, you must either create or join a Lumi Group.';

export const PRODUCT_CODE_TIMELINE = 'timeline';
export const PRODUCT_CODE_CHAT = 'chat';
export const PRODUCT_CODE_SUMMARY = 'summary';
export const PRODUCT_CODE_CARE_PROFILE = 'care-profile';
export const PRODUCT_CODE_SIGN_OUT = 'sign-out';

export const STORAGE_PATH_LUMI_IMAGES = 'lumi/images';

/*
 * CareProfile field IDs: Field IDs correspond to user properties in the DB
 */
// New care recipient
export const CARE_PROFILE_FIELD_ID_USER_LIST = 'userList';
// Basic
export const CARE_PROFILE_FIELD_ID_FIRST_NAME = 'firstName';
export const CARE_PROFILE_FIELD_ID_LAST_NAME = 'lastName';
export const CARE_PROFILE_FIELD_ID_BIRTHDAY = 'birthday';
export const CARE_PROFILE_FIELD_ID_GENDER = 'gender';
export const CARE_PROFILE_FIELD_ID_EMAIL = 'email';
export const CARE_PROFILE_FIELD_ID_ADDRESS = 'address';
// Medical
export const CARE_PROFILE_FIELD_ID_TYPE_OF_DEMENTIA = 'typeOfDementia';
export const CARE_PROFILE_FIELD_ID_DATE_OF_DIAGNOSIS = 'dateOfDiagnosis';
export const CARE_PROFILE_FIELD_ID_MEDICATIONS = 'medications';
export const CARE_PROFILE_FIELD_ID_PROVIDERS = 'providers';
// Care
export const CARE_PROFILE_FIELD_ID_NEEDS_AND_PREFERENCES = 'needsAndPreferences';
export const CARE_PROFILE_FIELD_ID_THINGS_THAT_DELIGHT = 'thingsThatDelight';
export const CARE_PROFILE_FIELD_ID_PLACES_OF_INTEREST = 'placesOfInterest';

/*
 * CareProfile field placeholders: Placeholders for each field
 */
// Basic
export const CARE_PROFILE_FIELD_PLACEHOLDER_FIRST_NAME = 'Enter first name';
export const CARE_PROFILE_FIELD_PLACEHOLDER_LAST_NAME = 'Enter last name';
export const CARE_PROFILE_FIELD_PLACEHOLDER_GENDER = 'Select gender';
export const CARE_PROFILE_FIELD_PLACEHOLDER_EMAIL = 'Enter email';
export const CARE_PROFILE_FIELD_PLACEHOLDER_ADDRESS = 'Enter address';
// Medical
export const CARE_PROFILE_FIELD_PLACEHOLDER_TYPE_OF_DEMENTIA = 'Select type of dementia';
export const CARE_PROFILE_FIELD_PLACEHOLDER_MEDICATIONS = 'Enter medications';
export const CARE_PROFILE_FIELD_PLACEHOLDER_PROVIDERS = 'Enter providers';
// Care
export const CARE_PROFILE_FIELD_PLACEHOLDER_NEEDS_AND_PREFERENCES = 'Enter needs and preferences';
export const CARE_PROFILE_FIELD_PLACEHOLDER_THINGS_THAT_DELIGHT =
  'Enter activities or objects that delight';
export const CARE_PROFILE_FIELD_PLACEHOLDER_PLACES_OF_INTEREST = 'Enter places of interest';

/*
 * CareProfile field titles: Title next to each field
 */
// Basic
export const CARE_PROFILE_FIELD_TITLE_FIRST_NAME = 'First Name';
export const CARE_PROFILE_FIELD_TITLE_LAST_NAME = 'Last Name';
export const CARE_PROFILE_FIELD_TITLE_BIRTHDAY = 'Birthday';
export const CARE_PROFILE_FIELD_TITLE_GENDER = 'Gender';
export const CARE_PROFILE_FIELD_TITLE_EMAIL = 'Email';
export const CARE_PROFILE_FIELD_TITLE_ADDRESS = 'Address';
// Medical
export const CARE_PROFILE_FIELD_TITLE_TYPE_OF_DEMENTIA = 'Type of Dementia';
export const CARE_PROFILE_FIELD_TITLE_DATE_OF_DIAGNOSIS = 'Date of Diagnosis';
export const CARE_PROFILE_FIELD_TITLE_MEDICATIONS = 'Medications';
export const CARE_PROFILE_FIELD_TITLE_PROVIDERS = 'Providers';
// Care
export const CARE_PROFILE_FIELD_TITLE_NEEDS_AND_PREFERENCES = 'Needs and Preferences';
export const CARE_PROFILE_FIELD_TITLE_THINGS_THAT_DELIGHT = 'Things that Delight';
export const CARE_PROFILE_FIELD_TITLE_PLACES_OF_INTEREST = 'Places of Interest';


/*
 * CareProfile unspecified options
 */
export const CARE_PROFILE_CODE_UNSPECIFIED = 'unspecified';
export const CARE_PROFILE_NAME_UNSPECIFIED = 'Unspecified';

/*
 * CareProfile gender options
 */
// Codes
export const CARE_PROFILE_GENDER_CODE_MALE = 'male';
export const CARE_PROFILE_GENDER_CODE_FEMALE = 'female';
// Names
export const CARE_PROFILE_GENDER_NAME_MALE = 'Male';
export const CARE_PROFILE_GENDER_NAME_FEMALE = 'Female';

/*
 * CareProfile type of dementia options
 */
// Codes
export const CARE_PROFILE_DEMENTIA_CODE_ALZHEIMERS = 'alzheimers';
export const CARE_PROFILE_DEMENTIA_CODE_VASCULAR = 'vascular';
export const CARE_PROFILE_DEMENTIA_CODE_LEWY = 'lewy';
export const CARE_PROFILE_DEMENTIA_CODE_FRONTOTEMPORAL = 'frontotemporal';
export const CARE_PROFILE_DEMENTIA_CODE_CREUTZFELDT_JAKOB = 'creutzfeldt-jakob';
export const CARE_PROFILE_DEMENTIA_CODE_WERNICKE_KORSAKOFF = 'wernicke-korsakoff';
export const CARE_PROFILE_DEMENTIA_CODE_MIXED = 'mixed';
export const CARE_PROFILE_DEMENTIA_CODE_OTHER = 'other';
export const CARE_PROFILE_DEMENTIA_CODE_UNKNOWN = 'unknown';
// Names
export const CARE_PROFILE_DEMENTIA_NAME_ALZHEIMERS = 'Alzheimer\'s disease';
export const CARE_PROFILE_DEMENTIA_NAME_VASCULAR = 'Vascular dementia';
export const CARE_PROFILE_DEMENTIA_NAME_LEWY = 'Dementia with Lewy bodies';
export const CARE_PROFILE_DEMENTIA_NAME_FRONTOTEMPORAL = 'Frontotemporal dementia';
export const CARE_PROFILE_DEMENTIA_NAME_CREUTZFELDT_JAKOB = 'Creutzfeldt-Jakob disease';
export const CARE_PROFILE_DEMENTIA_NAME_WERNICKE_KORSAKOFF = 'Wernicke-Korsakoff syndrome';
export const CARE_PROFILE_DEMENTIA_NAME_MIXED = 'Mixed dementia';
export const CARE_PROFILE_DEMENTIA_NAME_OTHER = 'Other';
export const CARE_PROFILE_DEMENTIA_NAME_UNKNOWN = 'Unknown';

/*
 * CareProfile new care recipient options
 */
// Code
export const CARE_PROFILE_CR_CODE_NEW_MEMBER = 'new-member';
// Name
export const CARE_PROFILE_CR_NAME_NEW_MEMBER = 'New Member';

export const CARE_PROFILE_NEW_CARE_RECIPIENT_PROMPT =
  'Welcome to CareProfile! Please choose a care recipient:';
export const CARE_PROFILE_CREATE_NEW_MEMBER_PROMPT = 'Please share details about the new member :)';

export const CARE_PROFILE_TABLE_HEADER_FIELD = 'Field';
export const CARE_PROFILE_TABLE_HEADER_VALUE = 'Value';
export const CARE_PROFILE_TABLE_HEADER_OPTIONS = 'Options';

export const TIMELINE_CATEGORY_CODE_STAR = 'star';
export const TIMELINE_CATEGORY_CODE_ALL = 'all';
export const TIMELINE_CATEGORY_CODE_ACTIVITY = 'activity';
export const TIMELINE_CATEGORY_CODE_BEHAVIOUR = 'behaviour';
export const TIMELINE_CATEGORY_CODE_MOOD = 'mood';
export const TIMELINE_CATEGORY_CODE_MEMORY = 'memory';
export const TIMELINE_CATEGORY_CODE_MEDICAL = 'medical';
export const TIMELINE_CATEGORY_CODE_CAREGIVER = 'caregiver';
export const TIMELINE_CATEGORY_CODE_OTHER = 'other';

export const TIMELINE_CATEGORY_NAME_STAR = 'Star';
export const TIMELINE_CATEGORY_NAME_ALL = 'All';
export const TIMELINE_CATEGORY_NAME_ACTIVITY = 'Activity';
export const TIMELINE_CATEGORY_NAME_BEHAVIOUR = 'Behaviour';
export const TIMELINE_CATEGORY_NAME_MOOD = 'Mood';
export const TIMELINE_CATEGORY_NAME_MEMORY = 'Memory';
export const TIMELINE_CATEGORY_NAME_MEDICAL = 'Medical';
export const TIMELINE_CATEGORY_NAME_CAREGIVER = 'Caregiver';
export const TIMELINE_CATEGORY_NAME_OTHER = 'Other';

export const TIMELINE_BUTTON_CODE_FILTER = 'timeline-button-code-filter';

export const URL_FACEBOOK_GRAPH_API = 'https://graph.facebook.com/v2.6';
export const URL_FACEBOOK_GRAPH_API_ME = `${URL_FACEBOOK_GRAPH_API}/me`;
export const URL_LUMI_WEBHOOK = 'https://us-central1-lumi-cares.cloudfunctions.net/webhook/lumi';
export const URL_LUMI_PSID = `${URL_LUMI_WEBHOOK}/psid`;
export const URL_LUMI_SAVE_IMAGE = `${URL_LUMI_WEBHOOK}/save-image`;

export const WEBSITE_TITLE = 'Lumi';

// Same max window width for timeline as Instagram
export const WINDOW_WIDTH_MAX = 600;
