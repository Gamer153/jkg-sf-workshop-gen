<script setup lang="ts">

import * as fs from "@tauri-apps/api/fs";
import * as dialog from "@tauri-apps/api/dialog";
import * as path from "@tauri-apps/api/path";
import Excel from "exceljs";
import { ref } from "vue";
import { DClass, DPupil, DWorkshopMap, SPupil, Workshop } from "./lib/data";
import { readWorkshops } from "./lib/loader";
import { ElButton, ElCard, ElContainer, ElAlert, ElMain, ElMessage, ElSteps, ElStep, ElHeader, ElLoading, ElDialog,  } from "element-plus";

const workshopData = ref<Map<number, Workshop> | undefined>(undefined);
const classData = ref<DClass[] | undefined>(undefined);
const step = ref(0);

const showAnewWarningDialogVisible = ref(false);

async function readWorkshopXLSX() {
  const path = await dialog.open({ title: "Workshopdaten-Excel-Datei auswählen", filters: [{ name: "Excel-Datei", extensions: ["xlsx"] }] });
  if (typeof path !== "string") return;
  const sheet = new Excel.Workbook();
  await sheet.xlsx.load(await fs.readBinaryFile(path));
  const [ readWorkshopData, warnings, error ] = readWorkshops(sheet.worksheets[0]);
  if (error) {
    await dialog.message("Beim Einlesen ist ein Fehler aufgetreten:\n" + error, { title: "Fehler beim Einlesen", type: "error" });
    return;
  }
  if (warnings.length > 0) {
    var msg = "";
    warnings.forEach((w) => msg += `\n- ${w}`);
    await dialog.message("Es sind Warnungen beim Einlesen aufgetreten (können ignoriert werden):" + msg, { title: "Warnungen beim Einlesen", type: "warning" });
  }
  workshopData.value = readWorkshopData;
  step.value++;
}

async function saveWorkshopTemplate() {
  const savePath = await dialog.save({ title: "Speicherort auswählen", defaultPath: "Workshopdaten.xlsx", filters: [{ name: "Excel-Datei", extensions: ["xlsx"] }] });
  if (typeof savePath !== "string") return;
  await fs.copyFile(await path.resolveResource("../resources/Workshopdaten.xlsx"), savePath);
  await dialog.message(`Erfolgreich als ${savePath} gespeichert.`, "Gespeichert.")
}

function readClassXLSX() {
  step.value++;
  calculateWorkshopSpread();
}

function saveClassTemplate() {
}

function getWorkshopCapacity() {
  if (!workshopData.value) return -1;
  var cap = 0;
  [...workshopData.value.values()].forEach((w) => cap += w.maxMembers);
  return cap;
}

async function calculateWorkshopSpread() {
  const loadW = ElLoading.service({
    text: "Berechnet..."
  });
  await new Promise((d) => window.setTimeout(d, 2000));
  loadW.close();
  step.value++;
}


function saveDoc(what: string) {
  step.value = 4;
}

function startAnew() {
  if (showAnewWarningDialogVisible.value) {
    workshopData.value = undefined;
    classData.value = undefined;
    step.value = 0;
    showAnewWarningDialogVisible.value = false;
  }
  else showAnewWarningDialogVisible.value = true;
}

</script>

<template>
  <ElHeader>
    <ElSteps :active="step" finish-status="success">
      <ElStep title="Workshopdaten einlesen" />
      <ElStep title="Schülerdaten einlesen" />
      <ElStep title="Workshopverteilung berechnen" />
      <ElStep title="Fertige Daten speichern" />
    </ElSteps>
  </ElHeader>
  <ElContainer style="margin-top: 16px;" v-if="step >= 3">
    <ElCard class="big-card">
      <template #header>
        Schritt 4: Fertige Daten
      </template>
      Die Berechnung ist fertig! Du kannst die fertigen, verarbeiteten Dateien jetzt speichern.<br>
      <ElButton type="success" style="margin-top: 8px;" @click="() => saveDoc('')">Excel-Datei mit Listen für jeden Workshop<b>-Leiter</b></ElButton><br>
      <ElButton type="success" style="margin-top: 8px;" @click="() => saveDoc('')">Excel-Datei mit Listen für jede Klasse (bzw. Klassensprecher)</ElButton><br>
      <ElButton type="danger" style="margin-top: 32px;" @click="startAnew">Erneut beginnen</ElButton><br>
      <ElDialog v-model="showAnewWarningDialogVisible">
        Willst du wirklich alle Daten zurücksetzen und von vorne beginnen?
        <template #footer>
          <ElButton type="danger" @click="startAnew">Ja</ElButton>
          <ElButton type="success" @click="() => showAnewWarningDialogVisible = false">Nein</ElButton>
        </template>
      </ElDialog>
    </ElCard>
  </ElContainer>
  <ElContainer style="margin-top: 16px;" v-if="step >= 2">
    <ElCard class="big-card" v-loading="true">
      <template #header>
        <span :style="(step > 2) ? 'text-decoration: line-through;' : ''">Schritt 3: Berechnung der Verteilung</span><span v-if="step > 2"> ✅</span>
      </template>
      <div v-if="step == 2">
        Berechnet...
      </div>
      <div style="font-size: smaller;" v-else>
        Fertig berechnet.
      </div>
    </ElCard>
  </ElContainer>
  <ElContainer style="margin-top: 16px;" v-if="step >= 1">
    <ElCard class="big-card">
      <template #header>
        <span :style="(step > 1) ? 'text-decoration: line-through;' : ''">Schritt 2: Schülerdaten einlesen</span><span v-if="step > 1"> ✅</span>
      </template>
      <div v-if="step == 1">
        Nun musst du die Datei mit den Schülerdaten einlesen.<br>
        <ElButton size="large" type="primary" style="margin-top: 8px;" @click="readClassXLSX">Schülerdaten-Datei auswählen</ElButton>
      </div>
      <div style="font-size: smaller;" v-else>
        Infos zu den Schülerdaten:
        <ul>
          <li>Anzahl Klassen: {{ classData?.length }}</li>
        </ul>
      </div>
    </ElCard>
  </ElContainer>
  <ElContainer style="margin-top: 16px;" v-if="step >= 0">
    <ElCard class="big-card">
      <template #header>
        <span :style="(step > 0) ? 'text-decoration: line-through;' : ''">Schritt 1: Workshopdaten einlesen</span><span v-if="step > 0"> ✅</span>
      </template>
      <div v-if="step == 0">
        Zuerst musst du <b>die ausgefüllte Excel-Datei mit den Workshopdaten</b> einlesen.<br>
        Damit die Daten ordentlich eingelesen werden können, müssen sie <b>genau so angeordnet</b> sein wie in der Vorlage!<br>
        <ElButton style="margin-top: 8px;" @click="saveWorkshopTemplate">Vorlage speichern</ElButton><br>
        <ElButton size="large" style="margin-top: 4px;" type="primary" @click="readWorkshopXLSX">Workshopdaten-Excel-Datei auswählen</ElButton>
      </div>
      <div style="font-size: smaller;" v-else>
        Infos zu den Workshopdaten:<br>
        <ul>
          <li>Anzahl Workshops: {{ workshopData?.size }}</li>
          <li>Maximale Kapazität aller Workshops: {{ getWorkshopCapacity() }}</li>
        </ul>
      </div>
    </ElCard>
  </ElContainer>
</template>

<style scoped>
.big-card {
  width: 100%;
  height: 100%;
  min-height: 100%;
}
</style>
