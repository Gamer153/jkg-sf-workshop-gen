<script setup lang="ts">

import * as fs from "@tauri-apps/api/fs";
import * as dialog from "@tauri-apps/api/dialog";
import Excel from "exceljs";
import { ref } from "vue";
import { DClass, DPupil, DWorkshopMap, SPupil, Workshop } from "./lib/data";

const workshopData = ref<DWorkshopMap | undefined>(undefined);
const classData = ref<DClass[] | undefined>(undefined);

async function readWorkshopXLSX() {
  const path = await dialog.open({ title: "Workshop-Daten-Excel-Datei auswählen", filters: [{ name: "Excel-Datei", extensions: ["xlsx"] }] });
  if (typeof path !== "string") return;
  const sheet = new Excel.Workbook();
  await sheet.xlsx.load(await fs.readBinaryFile(path));
  await dialog.message("Name des ersten Sheets: " + sheet.model.sheets[0].name);
  // TODO: read data
  workshopData.value = new Map<Workshop, DPupil>();
}

async function saveWorkshopTemplate() {
  const path = await dialog.save({ title: "Speicherort auswählen", defaultPath: "Workshopdaten.xlsx", filters: [{ name: "Excel-Datei", extensions: ["xlsx"] }] });
  if (typeof path !== "string") return;
  // TODO:
}

function doThings() {
}

</script>

<template>
  <div class="box">
    <span style="font-size: large; text-decoration: underline;">Ablauf:<br></span>
    <span :class="`${(workshopData) ? 'finished-task' : 'current-task'}`">1. Workshop-Daten einlesen</span><span v-if="workshopData"> ✅</span><br>
    <span :class="`${(workshopData) ? ((classData) ? 'finished-task' : 'current-task') : 'future-task'}`">2. Klassen-Daten einlesen</span>
  </div>
  <div v-if="workshopData === undefined">
    <h2>Schritt 1:</h2>
    Als erstes musst du die ausgefüllte Excel-Datei (<a style="cursor: pointer;" @click="saveWorkshopTemplate">Vorlage für Workshops speichern</a>) mit den Workshop-Daten einlesen.<br>
    <button @click="readWorkshopXLSX" style="margin-top: 8px;">Workshopdaten.xlsx lesen</button>
  </div>
  <div v-else-if="classData === undefined">
    <h2>Schritt 2:</h2>
    Dann musst du die ausgefüllte Excel-Datei (<a style="cursor: pointer;" @click="saveWorkshopTemplate">Vorlage für Klassen speichern</a>) mit den Klassen-Daten einlesen.<br>
    <button @click="readWorkshopXLSX" style="margin-top: 8px;">Klassendaten.xlsx lesen</button>
  </div>
  <button @click="doThings">Workshops berechnen</button><br>
</template>

<style scoped>
.box {
  margin: 4px;
  margin-top: 10px;
  padding: 8px;
  background-color: #252525;
  width: fit-content;
  border-radius: 8px;
}
.current-task {
  font-weight: bold;
}
.future-task {
  font-style: italic;
}
.finished-task {
  text-decoration: line-through;
}
</style>
