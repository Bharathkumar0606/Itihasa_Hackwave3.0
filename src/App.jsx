import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Camera,
  Check,
  ChevronDown,
  Compass,
  Headphones,
  Landmark,
  MapPin,
  Menu,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Volume2,
  X,
} from "lucide-react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { GoogleAuthProvider, getRedirectResult, onAuthStateChanged, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "./firebase";
import "leaflet/dist/leaflet.css";
import "./App.css";

const featuredPlaces = [
  {
    id: 1,
    name: "Aihole Durga Temple",
    state: "Karnataka",
    category: "Temple",
    description:
      "A quiet experiment in stone where the early Chalukyan builders tested the language of Indian temple architecture.",
    local_story_or_legend:
      "Locals say the river bends around the temple to protect the old stones during monsoon season.",
    full_address: "Aihole, Bagalkot district, Karnataka 587124",
    photo_url:
      "https://images.unsplash.com/photo-1600100397608-f010f8f3f8b7?auto=format&fit=crop&w=1000&q=85",
    thumbnail_url:
      "https://images.unsplash.com/photo-1600100397608-f010f8f3f8b7?auto=format&fit=crop&w=700&q=80",
    hidden_gem: true,
    hidden_gem_story:
      "Most visitors rush to Pattadakal. Aihole rewards the slower traveller with a whole landscape of first drafts.",
    "Story Naration":
      "Welcome to Aihole Durga Temple. Imagine a seventh-century workshop in warm sandstone, where every pillar is an architectural question. The temple sits quietly in a village landscape, but its experiments shaped the monuments that followed.",
    "Hidden jem image":
      "https://images.unsplash.com/photo-1600100397608-f010f8f3f8b7?auto=format&fit=crop&w=1200&q=85",
    must_visit_hidden_gem_reason:
      "For the traveller who wants an unhurried, close look at how temple architecture evolved.",
    tag: "Most loved",
    rating: "4.8",
    duration: "45 min",
  },
  {
    id: 2,
    name: "Rani ki Vav",
    state: "Gujarat",
    category: "Stepwell",
    description:
      "An inverted palace of carved stone, built as an act of remembrance and filled with more than five hundred major sculptures.",
    local_story_or_legend:
      "The stepwell is said to have been commissioned by Queen Udayamati in memory of her husband, King Bhima I.",
    full_address: "Mohan Nagar, Patan, Gujarat 384265",
    photo_url:
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1000&q=85",
    thumbnail_url:
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=700&q=80",
    hidden_gem: false,
    hidden_gem_story:
      "A celebrated site, but still full of details that only reveal themselves when you descend slowly.",
    "Story Naration":
      "This is Rani ki Vav, the Queen’s stepwell at Patan. Rather than walking up into a monument, you descend through seven levels of carved galleries. Water, memory, and craftsmanship meet here beneath the earth.",
    "Hidden jem image":
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85",
    must_visit_hidden_gem_reason:
      "For the traveller who wants to feel architecture change around them as they walk.",
    tag: "UNESCO",
    rating: "4.9",
    duration: "1 hr",
  },
  {
    id: 3,
    name: "Bateshwar Temple Cluster",
    state: "Madhya Pradesh",
    category: "Ruins",
    description:
      "A hundred small sandstone shrines rise from a forested valley, restored from ruins into a place of astonishing quiet.",
    local_story_or_legend:
      "The cluster is remembered locally as a place where the wind carries prayers from one shrine to the next.",
    full_address: "Morena, Madhya Pradesh 476001",
    photo_url:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85",
    thumbnail_url:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80",
    hidden_gem: true,
    hidden_gem_story:
      "A remarkable restoration story, far from the usual tourist circuit and surrounded by ravines and scrub.",
    "Story Naration":
      "In a valley near Morena, Bateshwar gathers more than a hundred small shrines close together. The cluster was once damaged and scattered, then carefully brought back into view. Listen for the space between the temples as much as the stones themselves.",
    "Hidden jem image":
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85",
    must_visit_hidden_gem_reason:
      "For a curious explorer who would rather find a landscape than queue for a landmark.",
    tag: "Quiet find",
    rating: "4.7",
    duration: "1.5 hrs",
  },
  {
    id: 4,
    name: "Bhimbetka Rock Shelters",
    state: "Madhya Pradesh",
    category: "Rock art",
    description:
      "Layered shelters preserve paintings and traces of human life across thousands of years, tucked into a sandstone landscape.",
    local_story_or_legend:
      "The name connects the caves to Bhima from the Mahabharata, who is said to have rested among these rocks.",
    full_address: "Bhojpur Raisen Road, Raisen, Madhya Pradesh 464551",
    photo_url:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1000&q=85",
    thumbnail_url:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=700&q=80",
    hidden_gem: true,
    hidden_gem_story:
      "A place where the first gallery is not a museum wall but the sheltering rock itself.",
    "Story Naration":
      "Bhimbetka is a living archive painted onto sandstone. Some shelters hold red and white figures of animals, dance, and daily life. Move gently through the landscape; the oldest stories here are also the most fragile.",
    "Hidden jem image":
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85",
    must_visit_hidden_gem_reason:
      "For anyone who wants to encounter history at human scale, one handprint at a time.",
    tag: "Ancient",
    rating: "4.8",
    duration: "2 hrs",
  },
  {
    id: 5,
    name: "Lepakshi Veerabhadra Temple",
    state: "Andhra Pradesh",
    category: "Temple",
    description:
      "A temple complex of painted ceilings, a giant monolithic Nandi, and a famous hanging pillar that barely meets the floor.",
    local_story_or_legend:
      "A local telling says the footprint near the temple belongs to Sita, left behind during her abduction.",
    full_address: "Lepakshi, Sri Sathya Sai district, Andhra Pradesh 515331",
    photo_url:
      "https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1000&q=85",
    thumbnail_url:
      "https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=700&q=80",
    hidden_gem: true,
    hidden_gem_story:
      "Look up: the ceiling paintings reward attention, and the famous pillar turns a structural mystery into a conversation.",
    "Story Naration":
      "Lepakshi is a theatre of stone and colour. Look for the long painted ceiling, the carved guardians, and the pillar that appears to float. The temple asks you to keep changing your point of view.",
    "Hidden jem image":
      "https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=85",
    must_visit_hidden_gem_reason:
      "For the detail hunter who likes monuments with a little architectural mischief.",
    tag: "For explorers",
    rating: "4.6",
    duration: "1 hr",
  },
  {
    id: 6,
    name: "Ramappa Temple",
    state: "Telangana",
    category: "Temple",
    description:
      "A star-shaped temple known for its light floating bricks, intricate dance sculptures, and a lake-side setting in Palampet.",
    local_story_or_legend:
      "The temple is named after its sculptor, Ramappa, an unusual honour that keeps the maker's name alive.",
    full_address: "Palampet, Mulugu district, Telangana 506303",
    photo_url:
      "https://images.unsplash.com/photo-1621509541433-9e0c8f0e9d1d?auto=format&fit=crop&w=1000&q=85",
    thumbnail_url:
      "https://images.unsplash.com/photo-1621509541433-9e0c8f0e9d1d?auto=format&fit=crop&w=700&q=80",
    hidden_gem: true,
    hidden_gem_story:
      "A UNESCO-listed temple away from the busiest routes, where the details reward a slow walk around the star-shaped plan.",
    "Story Naration":
      "This is Ramappa Temple in Telangana, a lake-side monument built in the thirteenth century. Look closely at the dancing figures and the way the temple seems to rise lightly from the earth. Its sculptor, Ramappa, is remembered by name in the monument itself.",
    "Hidden jem image":
      "https://images.unsplash.com/photo-1621509541433-9e0c8f0e9d1d?auto=format&fit=crop&w=1200&q=85",
    must_visit_hidden_gem_reason:
      "For travellers who want remarkable craft, a quieter setting, and a story that remembers the maker.",
    tag: "Telangana find",
    rating: "4.9",
    duration: "1 hr",
  },
];

const categories = [
  "All places",
  "Hidden gems",
  "Temples",
  "Stepwells",
  "Rock art",
  "Ruins",
];

const mapCenters = {
  Bengaluru: [15.2, 77.2],
  Telangana: [18.2, 79.8],
  Karnataka: [15.3, 75.7],
  Gujarat: [23.8, 72.1],
  "Madhya Pradesh": [23.2, 77.5],
  "Andhra Pradesh": [14.2, 78.2],
};

const mapPoints = {
  1: [15.989, 75.88],
  2: [23.858, 72.102],
  3: [26.983, 77.83],
  4: [22.938, 77.612],
  5: [14.12, 77.6],
  6: [18.26, 79.94],
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];
    if (character === '"' && quoted && nextCharacter === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  const headers = rows.shift().map((header) => header.trim());
  return rows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index]?.trim() || ""])));
}

function normalizeDatasetPlace(row, index) {
  const narration = row["Story Naration"] || row.description;
  const image = row["Hidden jem image "] || row.photo_url;
  const reliableImage = row.name === "Ramappa Temple"
    ? "/ramappa-temple.jpg"
    : image;
  return {
    id: `telangana-${index + 1}`,
    name: row.name,
    state: row.state || "Telangana",
    category: row.category || "Heritage",
    description: row.description || "A place with a story waiting to be explored.",
    local_story_or_legend: row.local_story_or_legend || row.hidden_gem_story || "A local story connected to this place.",
    full_address: row.full_address || row.name,
    photo_url: reliableImage || row.photo_url || image,
    thumbnail_url: row.name === "Ramappa Temple" ? reliableImage : row.thumbnail_url || row.photo_url || image,
    hidden_gem: false,
    hidden_gem_story: row.hidden_gem_story || "",
    "Story Naration": narration,
    "Hidden jem image": reliableImage,
    must_visit_hidden_gem_reason: row.must_visit_hidden_gem_reason || "A thoughtful stop for curious travellers.",
    tag: "Telangana dataset",
    rating: "New",
    duration: "",
  };
}

function CompanyLogo() {
  return <img className="company-logo" src="/company-logo.png" alt="Itihasa" />;
}

function formatAuthError(error) {
  const messages = {
    "auth/configuration-not-found": "Firebase Authentication is not configured for this project. Enable Authentication, enable Google sign-in, and add localhost under Authorized domains.",
    "auth/unauthorized-domain": "Add localhost to Firebase Authentication > Settings > Authorized domains.",
    "auth/operation-not-allowed": "Enable Google as a sign-in provider in Firebase Authentication.",
    "auth/popup-closed-by-user": "The Google sign-in window was closed before completing login.",
    "auth/network-request-failed": "Firebase could not reach Google. Check your network and try again.",
  };
  return messages[error.code] || error.message || "Google sign-in failed. Try again.";
}

function App() {
  const [datasetPlaces, setDatasetPlaces] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All places");
  const [search, setSearch] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [saved, setSaved] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showContribution, setShowContribution] = useState(false);
  const [submissionMode, setSubmissionMode] = useState("upload");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [submissionSent, setSubmissionSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [localStory, setLocalStory] = useState("");
  const [reviewResult, setReviewResult] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Telangana");
  const [viewMode, setViewMode] = useState("list");
  const [user, setUser] = useState(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState("");
  const [photoMessage, setPhotoMessage] = useState("");
  const [photoCameraOpen, setPhotoCameraOpen] = useState(false);
  const [profileRole, setProfileRole] = useState(() => localStorage.getItem("itihasa-profile-role") || "normal");
  const [profileName, setProfileName] = useState(() => localStorage.getItem("itihasa-profile-name") || "");
  const [showProfile, setShowProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const photoVideoRef = useRef(null);
  const photoCameraStreamRef = useRef(null);
  const places = datasetPlaces.filter((place) => place.state === "Telangana");

  const filteredPlaces = places.filter((place) => {
    const categoryAliases = {
      Temples: "Temple",
      Stepwells: "Stepwell",
      "Rock art": "Rock art",
      Ruins: "Ruins",
    };
    const categoryMatch =
      activeCategory === "All places" ||
      (activeCategory === "Hidden gems"
        ? place.hidden_gem
        : place.category === categoryAliases[activeCategory]);
    const searchMatch = `${place.name} ${place.state} ${place.category}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const locationMatch = place.state === selectedLocation;
    return categoryMatch && searchMatch && locationMatch;
  });

  useEffect(() => {
    if (profileRole === "normal") return;
    setActiveCategory("All places");
    setSearch("");
    setSelectedLocation("Telangana");
  }, [profileRole]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  useEffect(() => {
    fetch("/telangana-top-30.csv")
      .then((response) => {
        if (!response.ok) throw new Error("Dataset could not be loaded.");
        return response.text();
      })
      .then((text) => setDatasetPlaces(parseCsv(text).map(normalizeDatasetPlace)))
      .catch(() => setDatasetPlaces([]));
  }, []);

  useEffect(() => {
    const handleAuthState = (nextUser) => {
      setUser(nextUser);
      if (nextUser && !localStorage.getItem(`itihasa-profile-${nextUser.uid}`)) setShowProfile(true);
    };
    const unsubscribe = onAuthStateChanged(auth, handleAuthState);
    getRedirectResult(auth).catch((error) => setAuthError(formatAuthError(error)));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!showContribution || submissionMode !== "camera") {
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
      return undefined;
    }
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        cameraStreamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setSubmissionMode("upload"));
    return () => {
      cancelled = true;
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [showContribution, submissionMode]);

  useEffect(() => {
    if (!photoCameraOpen) {
      photoCameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      photoCameraStreamRef.current = null;
      return undefined;
    }
    let cancelled = false;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((track) => track.stop()); return; }
        photoCameraStreamRef.current = stream;
        if (photoVideoRef.current) photoVideoRef.current.srcObject = stream;
      })
      .catch((error) => setPhotoMessage(error.message || "Camera permission was not granted."));
    return () => { cancelled = true; photoCameraStreamRef.current?.getTracks().forEach((track) => track.stop()); };
  }, [photoCameraOpen]);

  function getSpeechVoices() {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) return Promise.resolve(voices);
    return new Promise((resolve) => {
      const handleVoicesChanged = () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
        resolve(window.speechSynthesis.getVoices());
      };
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged, { once: true });
      window.setTimeout(() => {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
        resolve(window.speechSynthesis.getVoices());
      }, 1000);
    });
  }

  async function toggleSpeech(place) {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(place["Story Naration"]);
    const availableVoices = await getSpeechVoices();
    const maleVoice = (voice) => /male|man|david|mark|daniel|george|james|rishi|ravi|google uk english male|google us english male/i.test(voice.name);
    const preferredVoice = availableVoices.find((voice) => /en-IN|Indian English/i.test(`${voice.lang} ${voice.name}`) && maleVoice(voice))
      || availableVoices.find((voice) => /^en-(GB|AU|US)/i.test(voice.lang) && maleVoice(voice))
      || availableVoices.find((voice) => /^en-/i.test(voice.lang) && maleVoice(voice))
      || availableVoices.find((voice) => /en-IN|Indian English/i.test(`${voice.lang} ${voice.name}`))
      || availableVoices.find((voice) => /^en-(GB|AU|US)/i.test(voice.lang) && !voice.default)
      || availableVoices.find((voice) => /^en-/i.test(voice.lang) && !voice.default)
      || availableVoices.find((voice) => /^en-/i.test(voice.lang));
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  function toggleSaved(id) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function closePlaceDetails() {
    setPhotoCameraOpen(false);
    setSelectedPlace(null);
  }

  function openContribution(mode = "upload") {
    setSubmissionMode(mode);
    setShowContribution(true);
  }

  async function signIn() {
    setAuthBusy(true);
    setAuthError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      if (error.code === "auth/popup-blocked" || error.code === "auth/popup-closed-by-user") {
        try {
          await signInWithRedirect(auth, new GoogleAuthProvider());
          return;
        } catch (redirectError) {
          setAuthError(formatAuthError(redirectError));
        }
      } else {
        setAuthError(formatAuthError(error));
      }
    } finally {
      setAuthBusy(false);
    }
  }

  async function requireUser() {
    if (user) return user;
    await signIn();
    return auth.currentUser;
  }

  async function addRating() {
    if (!selectedPlace || !selectedRating) return;
    try {
      const signedInUser = await requireUser();
      if (!signedInUser) return;
      await addDoc(collection(db, "ratings"), { placeId: selectedPlace.id, userId: signedInUser.uid, stars: selectedRating, createdAt: serverTimestamp() });
      setRatingMessage("Your rating helps improve the next recommendation.");
    } catch (error) { setRatingMessage(error.message || "Rating could not be saved."); }
  }

  async function addPlacePhoto(event) {
    const file = event.target.files?.[0];
    if (!file || !selectedPlace) return;
    try {
      const signedInUser = await requireUser();
      if (!signedInUser) return;
      await savePlacePhoto(file, signedInUser);
      setPhotoMessage("Photo added for community review.");
    } catch (error) { setPhotoMessage(error.message || "Photo could not be uploaded. Check Firebase Storage rules."); }
  }

  async function savePlacePhoto(file, signedInUser) {
    const photoRef = ref(storage, `place-photos/${selectedPlace.id}/${signedInUser.uid}-${Date.now()}-${file.name}`);
    await uploadBytes(photoRef, file, { contentType: file.type });
    const photoUrl = await getDownloadURL(photoRef);
    await addDoc(collection(db, "placePhotos"), { placeId: selectedPlace.id, userId: signedInUser.uid, photoUrl, createdAt: serverTimestamp() });
  }

  async function capturePlacePhoto() {
    if (!photoVideoRef.current || !selectedPlace) return;
    try {
      const signedInUser = await requireUser();
      if (!signedInUser) return;
      const canvas = document.createElement("canvas");
      canvas.width = photoVideoRef.current.videoWidth || 1280;
      canvas.height = photoVideoRef.current.videoHeight || 720;
      canvas.getContext("2d").drawImage(photoVideoRef.current, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
      await savePlacePhoto(new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" }), signedInUser);
      setPhotoMessage("Live camera photo added for community review.");
      setPhotoCameraOpen(false);
    } catch (error) { setPhotoMessage(error.message || "Camera photo could not be uploaded."); }
  }

  async function saveProfile() {
    if (!user || !profileName.trim()) return;
    setShowProfile(false);
    try {
      await addDoc(collection(db, "userProfiles"), { uid: user.uid, displayName: profileName.trim(), role: profileRole, email: user.email || "", createdAt: serverTimestamp() });
    } catch { /* local profile still keeps the experience usable when rules are pending */ }
    localStorage.setItem("itihasa-profile-role", profileRole);
    localStorage.setItem("itihasa-profile-name", profileName.trim());
    localStorage.setItem(`itihasa-profile-${user.uid}`, "saved");
    setProfileSaved(true);
  }

  function closeContribution() {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    setShowContribution(false);
    setSubmissionSent(false);
    setSelectedMedia(null);
    setPlaceName("");
    setLocalStory("");
    setSubmissionError("");
    setReviewResult(null);
  }

  function handleMediaChange(event) {
    const file = event.target.files?.[0];
    if (file)
      setSelectedMedia({
        file,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      });
  }

  async function submitContribution() {
    if (!placeName.trim() || !localStory.trim()) {
      setSubmissionError("Add a place name and local story before submitting.");
      return;
    }
    setSubmitting(true);
    setSubmissionError("");
    try {
      const signedInUser = await requireUser();
      if (!signedInUser) throw new Error("Sign in with Google to share a place.");
      let mediaUrl = "";
      if (selectedMedia?.file) {
        const mediaRef = ref(storage, `submissions/${signedInUser.uid}/${Date.now()}-${selectedMedia.file.name}`);
        await uploadBytes(mediaRef, selectedMedia.file, { contentType: selectedMedia.file.type });
        mediaUrl = await getDownloadURL(mediaRef);
      }
      const response = await fetch("/api/featherless/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeName: placeName.trim(),
          localStory: localStory.trim(),
          state: selectedLocation,
          mediaType: selectedMedia?.type || "",
          mediaUrl,
          contributorId: signedInUser.uid,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Featherless review failed.");
      setReviewResult(payload.review);
      setSubmissionSent(true);
    } catch (error) {
      setSubmissionError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  function captureSubmissionPhoto() {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `live-share-${Date.now()}.jpg`, { type: "image/jpeg" });
      setSelectedMedia({ file, name: file.name, url: URL.createObjectURL(file), type: file.type });
      setSubmissionMode("upload");
    }, "image/jpeg", 0.88);
  }

  return (
    <div className={`app-shell role-${profileRole}`}>
      <header className="topbar">
        <a className="brand" href="#discover" aria-label="Itihasa home">
          <CompanyLogo />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a className="active" href="#discover">
            Discover
          </a>
          <button type="button" onClick={() => { setViewMode("map"); document.querySelector(".explore-section")?.scrollIntoView({ behavior: "smooth" }); }}>
            Map view
          </button>
          <a href="#contribute">Contribute</a>
        </nav>
        <div className="header-actions">
          <button className="saved-link" type="button">
            <Bookmark size={16} /> Saved <span>{saved.length}</span>
          </button>
          <button
            className="menu-button"
            type="button"
            aria-label="Open menu"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Menu size={19} />
          </button>
          <button
            className="profile-button"
            type="button"
            aria-label={user ? "Signed in profile" : "Sign in with Google"}
            onClick={() => user ? setShowProfile(true) : signIn()}
            disabled={authBusy}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" />
            ) : user ? (
              user.displayName?.slice(0, 2).toUpperCase() || "AS"
            ) : (
              "AS"
            )}
          </button>
        </div>
        {authError && <span className="auth-status" role="alert">{authError}</span>}
        {showMenu && (
          <div className="mobile-menu">
            <a href="#discover">Discover</a>
            <button
              type="button"
              onClick={() => {
                setViewMode("map");
                setShowMenu(false);
                document.querySelector(".explore-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Map view
            </button>
            <a href="#contribute">Contribute</a>
          </div>
        )}
      </header>
      <main>
        <section className="intro" id="discover">
          <div className="intro-copy">
            <p className="eyebrow">
              <span className="eyebrow-line"></span> Where every place comes alive
            </p>
            <h1>
              Look closer. There’s
              <br />
              <em>a story here.</em>
            </h1>
            <p className="intro-text">
              {profileRole === "blind"
                ? "Explore heritage through clear narration, local voices, and audio-first discovery."
                : "Explore remarkable places, meet the characters behind their stories, and discover history through play, curiosity, and adventure."}
            </p>
            <p className="moving-strap">Discover the past. Experience it your way.</p>
            <div className="mode-badge"><span className="mode-badge-dot"></span>{profileRole === "blind" ? "Audio-first experience" : profileRole === "child" ? "Young explorer mode" : "Explorer mode"}</div>
            <div className="intro-actions">
              <button
                className="primary-action"
                type="button"
                onClick={() =>
                  document
                    .querySelector(".explore-section")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Start exploring <ArrowRight size={17} />
              </button>
              <button
                className="text-action"
                type="button"
                onClick={() => { setSelectedLocation("Telangana"); setActiveCategory("Hidden gems"); document.querySelector(".explore-section")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                What’s hiding nearby? <Compass size={16} />
              </button>
            </div>
          </div>
          <div className="intro-image">
            <img
              src="https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=85"
              alt="Indian temple architecture with detailed stone carvings"
            />
            <div className="image-note">
              <span className="note-dot"></span>
              <span>Today’s discovery</span>
              <strong>
                “Every place has a story.
                <br />
                Go find yours.”
              </strong>
            </div>
          </div>
        </section>
        {profileRole === "child" && (
          <>
            <section className="child-time-travel" aria-label="Ancient India time travel adventure">
            <div className="child-adventure-copy">
              <p className="eyebrow">BECOME A HISTORY DETECTIVE</p>
              <h2>What’s hiding<br />nearby?</h2>
              <p>Choose a character, follow the clues, and unlock a story from the past.</p>
              <button className="child-start-button" type="button" onClick={() => { setActiveCategory("All places"); setSearch(""); }}><Sparkles size={17} /> Start exploring</button>
            </div>
            <div className="ancient-scene" aria-hidden="true">
              <div className="scene-sun"></div><div className="scene-hill scene-hill-one"></div><div className="scene-hill scene-hill-two"></div>
              <div className="scene-character scene-elephant"><span>🐘</span><small>Temple guardian</small></div>
              <div className="scene-character scene-peacock"><span>🦚</span><small>Forest friend</small></div>
              <div className="scene-character scene-storyteller"><span>🧑🏽‍🏫</span><small>Story keeper</small></div>
              <div className="scene-path"></div><div className="scene-stupa"></div>
            </div>
            </section>
            <section className="child-explorer-section" aria-labelledby="child-explorer-title">
              <p className="eyebrow">A SHARED JOURNEY THROUGH HISTORY</p>
              <h2 id="child-explorer-title">History is for every explorer.</h2>
              <p>Listen to a story, follow the clues, explore at your own pace, or simply look closer. Itihasa gives every child a way to discover, learn, and connect with the past.</p>
              <span>Different ways to explore. One shared journey through history.</span>
            </section>
          </>
        )}
        <section className="contribute-rail" aria-labelledby="contribute-now-title">
          <div className="contribute-rail-copy">
            <p className="eyebrow">GIVE A PLACE A VOICE</p>
            <h2 id="contribute-now-title">Know somewhere special?</h2>
            <p>Share the place, the photograph, and the story. Sign in when you submit so the community can trust the source.</p>
          </div>
          <div className="contribute-rail-actions">
            <button className="primary-action" type="button" onClick={() => openContribution("upload")}><Landmark size={17} /> Submit a place</button>
            <button className="camera-action" type="button" onClick={() => openContribution("camera")}><Camera size={17} /> Live camera share</button>
          </div>
        </section>
        <section className="explore-section" aria-labelledby="explore-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CURATED FOR THE CURIOUS</p>
              <h2 id="explore-heading">Find your next story</h2>
            </div>
            <label className="location-pill">
              <MapPin size={15} />
              <select value={selectedLocation} onChange={(event) => setSelectedLocation(event.target.value)} aria-label="Choose a region">
                <option>Telangana</option>
              </select>
              <ChevronDown size={14} />
            </label>
          </div>
          <div className="discovery-tools">
            <div className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search a place, state, or story"
                aria-label="Search places"
              />
            </div>
            <div
              className="category-tabs"
              role="tablist"
              aria-label="Filter places"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? "selected" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                  {category === "Hidden gems" && (
                    <span className="new-dot"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="result-meta">
            <span>{filteredPlaces.length} places to wander into from {selectedLocation}</span>
            <button type="button">
              <ShieldCheck size={14} /> Curated by local knowledge
            </button>
          </div>
          <div className="view-switcher" role="group" aria-label="Discovery view">
            <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}><Landmark size={14} /> List</button>
            <button type="button" className={viewMode === "map" ? "active" : ""} onClick={() => setViewMode("map")}><MapPin size={14} /> Map</button>
          </div>
          {viewMode === "map" && <div className="map-view" id="map" aria-label={`Heritage places map for ${selectedLocation}`}><MapContainer key={selectedLocation} center={mapCenters[selectedLocation]} zoom={selectedLocation === "Bengaluru" ? 5 : 7} scrollWheelZoom className="leaflet-map"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{filteredPlaces.filter((place) => mapPoints[place.id]).map((place) => <CircleMarker key={place.id} center={mapPoints[place.id]} pathOptions={{ color: "#b6533c", fillColor: "#b6533c", fillOpacity: 0.85 }} radius={9}><Popup><button className="map-popup-button" type="button" onClick={() => setSelectedPlace(place)}><strong>{place.name}</strong><span>{place.category} · {place.state}</span><em>Open story</em></button></Popup></CircleMarker>)}</MapContainer></div>}
          {viewMode === "list" && <div className="place-grid">
            {filteredPlaces.map((place) => (
              <article
                className="place-card"
                key={place.id}
                onClick={() => setSelectedPlace(place)}
              >
                <div className="card-image">
                  <img
                    src={place.thumbnail_url}
                    alt={place.name}
                    loading="lazy"
                  />
                  <span className="place-tag">{place.tag}</span>
                  <button
                    className={`save-button ${saved.includes(place.id) ? "is-saved" : ""}`}
                    aria-label={
                      saved.includes(place.id)
                        ? `Remove ${place.name} from saved`
                        : `Save ${place.name}`
                    }
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleSaved(place.id);
                    }}
                  >
                    <Bookmark
                      size={17}
                      fill={saved.includes(place.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <div className="card-body">
                  <div className="place-kicker">
                    <span>{place.category}</span>
                    <span className="rating">★ {place.rating}</span>
                  </div>
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                  <div className="card-footer">
                    <span>
                      <MapPin size={13} /> {place.state}
                    </span>
                    <span>{place.duration} read</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </article>
            ))}
          </div>}
          {filteredPlaces.length === 0 && (
            <div className="empty-state">
              <Search size={25} />
              <h3>No stories found yet</h3>
              <p>Try another state, place, or category.</p>
            </div>
          )}
        </section>
        <section className="listen-band" id="contribute">
          <div className="listen-icon">
            <Headphones size={25} />
          </div>
          <div>
            <p className="eyebrow">ACCESSIBLE BY DESIGN</p>
            <h2>Let the place tell you its story.</h2>
            <p>
              Every heritage entry includes a carefully written narration.
              Listen while you walk, rest your eyes, or share the journey with
              someone else.
            </p>
          </div>
          <div className="listen-actions">
            <button
              type="button"
              className="listen-example"
              onClick={() => setSelectedPlace(places[0])}
            >
              <Volume2 size={18} /> Hear an example
            </button>
            <button
              type="button"
              className="contribute-button"
              onClick={() => openContribution("upload")}
            >
              <Landmark size={16} /> Share a place
            </button>
          </div>
        </section>
      </main>
      <footer className="company-footer" id="about">
        <div className="footer-brand-column">
          <a className="brand footer-brand" href="#discover"><CompanyLogo /></a>
          <p>A community-powered heritage archive helping people discover, understand, and care for the places around them.</p>
          <span className="footer-note">Built for curious travellers, local storytellers, and future historians.</span>
        </div>
        <div className="footer-column"><p className="footer-label">Company</p><a href="#about">About Itihasa</a><a href="#contribute">Community guidelines</a><a href="#discover">Our approach</a></div>
        <div className="footer-column"><p className="footer-label">Explore</p><a href="#discover">Heritage places</a><a href="#map" onClick={() => setViewMode("map")}>Map view</a><a href="#contribute">Share a place</a></div>
        <div className="footer-column footer-contact"><p className="footer-label">Contact</p><a href="mailto:hello@itihasa.in">hello@itihasa.in</a><span>India · Community heritage</span><span>© {new Date().getFullYear()} Itihasa</span></div>
      </footer>
      {selectedPlace && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => {
            window.speechSynthesis?.cancel();
            setIsSpeaking(false);
            closePlaceDetails();
          }}
        >
          <article
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="place-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-button"
              type="button"
              onClick={closePlaceDetails}
              aria-label="Close story"
            >
              <X size={18} />
            </button>
            <img
              className="modal-image"
              src={selectedPlace["Hidden jem image"] || selectedPlace.photo_url}
              alt={selectedPlace.name}
            />
            <div className="modal-content">
              <div className="place-kicker">
                <span>
                  {selectedPlace.category} · {selectedPlace.state}
                </span>
                <span className="rating">★ {selectedPlace.rating}</span>
              </div>
              <h2 id="place-title">{selectedPlace.name}</h2>
              <p className="modal-address">
                <MapPin size={14} /> {selectedPlace.full_address}
              </p>
              {profileRole !== "normal" && <div className="listen-player">
                <div className="player-icon">
                  <Volume2 size={19} />
                </div>
                <div className="player-copy">
                  <strong>
                    {isSpeaking ? "Playing the story" : "Listen to the story"}
                  </strong>
                  <span>
                    {isSpeaking
                      ? "You can pause whenever you like."
                      : "Narrated for every kind of traveller."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSpeech(selectedPlace)}
                  aria-label={isSpeaking ? "Pause narration" : "Play narration"}
                >
                  {isSpeaking ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} fill="currentColor" />
                  )}
                </button>
              </div>}
              <div className="story-section">
                <p className="eyebrow">STORY NARRATION</p>
                <p>{selectedPlace["Story Naration"] || selectedPlace.description}</p>
              </div>
              <div className="why-section">
                <Check size={18} />
                <p>
                  <strong>Why go</strong>
                  {selectedPlace.must_visit_hidden_gem_reason}
                </p>
              </div>
              <div className="community-tools">
                <div className="rating-tool">
                  <strong>Rate this place</strong>
                  <div className="star-picker" role="group" aria-label="Choose a rating">
                    {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" className={star <= selectedRating ? "chosen" : ""} onClick={() => setSelectedRating(star)} aria-label={`${star} stars`}>★</button>)}
                  </div>
                  <button className="small-action" type="button" onClick={addRating}>{user ? "Save rating" : "Sign in to rate"}</button>
                  {ratingMessage && <span className="tool-message">{ratingMessage}</span>}
                </div>
                <div className="photo-tool">
                  <strong>Add a community photo</strong>
                  {photoCameraOpen ? <div className="photo-camera"><video ref={photoVideoRef} autoPlay playsInline muted aria-label="Live community photo camera" /><button className="small-action" type="button" onClick={capturePlacePhoto}><Camera size={13} /> Capture and share</button><button className="camera-cancel" type="button" onClick={() => setPhotoCameraOpen(false)}>Cancel</button></div> : <div className="photo-actions"><label className="small-action"><input type="file" accept="image/*" onChange={addPlacePhoto} />{user ? "Upload photo" : "Sign in to add"}</label><button className="small-action" type="button" onClick={async () => { const signedInUser = await requireUser(); if (signedInUser) setPhotoCameraOpen(true); }}><Camera size={13} /> Live camera</button></div>}
                  {photoMessage && <span className="tool-message">{photoMessage}</span>}
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="primary-action"
                  type="button"
                  onClick={() => toggleSaved(selectedPlace.id)}
                >
                  <Bookmark
                    size={16}
                    fill={
                      saved.includes(selectedPlace.id) ? "currentColor" : "none"
                    }
                  />
                  {saved.includes(selectedPlace.id) ? "Saved" : "Save place"}
                </button>
                <button
                  className="secondary-action"
                  type="button"
                  onClick={closePlaceDetails}
                >
                  Back to discover
                </button>
              </div>
            </div>
          </article>
        </div>
      )}
      {showContribution && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={closeContribution}
        >
          <article
            className="contribution-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contribution-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-button"
              type="button"
              onClick={closeContribution}
              aria-label="Close contribution form"
            >
              <X size={18} />
            </button>
            {submissionSent ? (
              <div className="submission-success">
                <div className="success-mark">
                  <Check size={25} />
                </div>
                <p className="eyebrow">SUBMISSION RECEIVED</p>
                <h2>Your local story is in good hands.</h2>
                <p>
                  It will be AI-reviewed for clarity and safety before it joins
                  the living archive.
                </p>
                {reviewResult && (
                  <div className="review-result">
                    <strong>{reviewResult.status || "AI Reviewed"}</strong>
                    <span>{reviewResult.publicNote || "Featherless reviewed this submission."}</span>
                  </div>
                )}
                <button
                  className="primary-action"
                  type="button"
                  onClick={closeContribution}
                >
                  Return to discover
                </button>
              </div>
            ) : (
              <>
                <div className="contribution-head">
                  <p className="eyebrow">ADD TO THE ARCHIVE</p>
                  <h2 id="contribution-title">
                    Share a place
                    <br />
                    <em>worth remembering.</em>
                  </h2>
                  <p>
                    Upload a photo or point your camera at the place. Your story
                    helps someone else find it.
                  </p>
                </div>
                <div className="capture-tabs">
                  <button
                    type="button"
                    className={submissionMode === "upload" ? "active" : ""}
                    onClick={() => setSubmissionMode("upload")}
                  >
                    <Bookmark size={16} /> Upload media
                  </button>
                  <button
                    type="button"
                    className={submissionMode === "camera" ? "active" : ""}
                    onClick={() => setSubmissionMode("camera")}
                  >
                    <Landmark size={16} /> Live camera
                  </button>
                </div>
                <div className="capture-box">
                  {submissionMode === "camera" ? (
                    <div className="submission-camera-preview"><video ref={videoRef} autoPlay playsInline muted aria-label="Live camera preview" /><button className="camera-capture-button" type="button" onClick={captureSubmissionPhoto}><Camera size={17} /> Capture photo</button></div>
                  ) : selectedMedia ? (
                    selectedMedia.type.startsWith("video/") ? (
                      <video
                        src={selectedMedia.url}
                        controls
                        aria-label="Selected video preview"
                      />
                    ) : (
                      <img
                        src={selectedMedia.url}
                        alt="Selected heritage media preview"
                      />
                    )
                  ) : (
                    <label className="upload-prompt">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMediaChange}
                      />
                      <span className="upload-icon">
                        <ArrowRight size={20} />
                      </span>
                      <strong>Choose a photo or video</strong>
                      <small>JPG, PNG, or MP4 up to 20 MB</small>
                    </label>
                  )}
                </div>
                <div className="submission-fields">
                  <label>
                    Place name
                    <input value={placeName} onChange={(event) => setPlaceName(event.target.value)} placeholder="What is this place called?" />
                  </label>
                  <label>
                    Local story or legend
                    <textarea
                      value={localStory}
                      onChange={(event) => setLocalStory(event.target.value)}
                      placeholder="What should visitors know?"
                      rows="3"
                    />
                  </label>
                </div>
                {submissionError && <p className="submission-error" role="alert">{submissionError}</p>}
                <button
                  className="primary-action submit-button"
                  type="button"
                  onClick={submitContribution}
                  disabled={submitting}
                >
                  {submitting ? "Reviewing with Featherless..." : "Send for AI review"} <ArrowRight size={16} />
                </button>
              </>
            )}
          </article>
        </div>
      )}
      {user && showProfile && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowProfile(false)}>
          <article className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" type="button" onClick={() => setShowProfile(false)} aria-label="Close profile"><X size={18} /></button>
            <div className="profile-avatar-large">{user.photoURL ? <img src={user.photoURL} alt="" /> : <UserRound size={28} />}</div>
            <p className="eyebrow">YOUR ITIHASA PROFILE</p>
            <h2 id="profile-title">Make the archive yours.</h2>
            <p className="profile-subtitle">Choose how you want to experience heritage. You can change this anytime.</p>
            <label className="profile-name-field">Your name<input value={profileName} onChange={(event) => setProfileName(event.target.value)} placeholder={user.displayName || "Your name"} /></label>
            <div className="role-options" role="radiogroup" aria-label="Choose your experience">
              <button type="button" className={profileRole === "normal" ? "chosen" : ""} onClick={() => setProfileRole("normal")}><UserRound size={18} /><strong>Explorer</strong><span>Full discovery, maps, ratings, and stories.</span></button>
              <button type="button" className={profileRole === "blind" ? "chosen" : ""} onClick={() => setProfileRole("blind")}><Volume2 size={18} /><strong>Audio first</strong><span>Large listening controls and narration-led browsing.</span></button>
              <button type="button" className={profileRole === "child" ? "chosen" : ""} onClick={() => setProfileRole("child")}><Sparkles size={18} /><strong>Young explorer</strong><span>Playful visuals, short stories, and gentle discovery.</span></button>
            </div>
            <button className="primary-action profile-save" type="button" onClick={saveProfile} disabled={!profileName.trim()}>Save my profile <Check size={16} /></button>
            {profileSaved && <span className="tool-message">Profile saved.</span>}
          </article>
        </div>
      )}
      {profileRole !== "normal" && <button className="accessibility-listen" type="button" onClick={() => toggleSpeech(selectedPlace || places[0])} aria-label={isSpeaking ? "Stop narration" : "Listen to this heritage story"}>
        {isSpeaking ? <Pause size={20} /> : <Volume2 size={20} />}<span>{isSpeaking ? "Stop listening" : "Listen to story"}</span>
      </button>}
    </div>
  );
}

export default App;
