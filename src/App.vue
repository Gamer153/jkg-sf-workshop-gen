<script setup lang="ts">

import * as fs from "@tauri-apps/api/fs";
import * as dialog from "@tauri-apps/api/dialog";
import * as path from "@tauri-apps/api/path";
import * as shell from "@tauri-apps/api/shell";
import Excel, { ValueType } from "exceljs";
import colCache from "exceljs/lib/utils/col-cache";
import { ref } from "vue";
import { DClass, DPupil, DWorkshopMap, SPupil, Workshop } from "./lib/data";
import { readWorkshops, WorkshopColumnType } from "./lib/loader";
import { ElButton, ElCard, ElContainer, ElAlert, ElMain, ElMessage, ElSteps, ElStep, ElHeader, ElLoading, ElDialog, ElFooter, ElIcon, ElLink, ElDropdown, ElSelect, ElOption } from "element-plus";

const workshopData = ref<Map<number, Workshop>>();
const classData = ref<DClass[]>();
const step = ref(0);

const showAnewWarningDialog = ref(false);
const showMailDialog = ref(false);

const workshopFile = ref<Excel.Worksheet>();
const workshopColumnOptions = ref<Map<number, string>>();
const autoGenWId = ref(false);
const currentWorkshopColumnMappings = ref(new Map<WorkshopColumnType, number>());

const classFile = ref<Excel.Worksheet>();

async function readWorkshopXLSX() {
  const path = await dialog.open({ title: "Workshopdaten-Excel-Datei auswählen", filters: [{ name: "Excel-Datei", extensions: ["xlsx"] }] });
  if (typeof path !== "string") return;
  const sheet = new Excel.Workbook();
  await sheet.xlsx.load(await fs.readBinaryFile(path));
  if (
    sheet.worksheets.length > 1 &&
    !await dialog.ask("Das ausgewählte Dokument enthält mehr als 1 Tabellenblatt! Es wird nur das erste gelesen. Soll trotzdem fortgefahren werden?", "Fortfahren?")
  ) return;
  const worksheet = sheet.worksheets[0];
  if (
    !await dialog.ask("Der Inhalt der ersten Zeile wird als Beschriftung für die Spalten verwendet. Enthält die erste Zeile die Spalten-Beschriftungen?", "Bestätigung")
  ) return;
  const maybeFirstId = worksheet.findCell("A2", "");
  if (!maybeFirstId || maybeFirstId.text == "") {
    await dialog.message("Zelle A2 hat keinen Inhalt. Dort müsste sich die erste Workshop-ID oder der erste Workshop-Name befinden. Abbruch.", { type: "error", title: "Fehler" });
    return;
  }
  if (maybeFirstId.type != ValueType.Number && isNaN(parseInt(maybeFirstId.text))) {
    if (!await dialog.ask("Die erste Spalte scheint keine Workshop-IDs zu enthalten. Wenn du fortfährst, werden die Workshops automatisch nach Reihennummer nummeriert. Fortfahren?"))
      return;
    else autoGenWId.value = true;
  }
  if (worksheet.getRow(1).actualCellCount < (autoGenWId.value ? 5 : 6)) {
    await dialog.message(`Die erste Zeile (Beschriftungen) muss mindestens ${autoGenWId.value ? 5 : 6} Zellen mit Daten enthalten!`);
    return;
  }

  const colOpts = new Map<number, string>();
  worksheet.getRow(1).eachCell((cell) => colOpts.set(cell.col as unknown as number, (cell.text.trim() == "") ? `(Spalte ${cell.col})` : cell.text));
  workshopColumnOptions.value = colOpts;
  console.log(colOpts)

  workshopFile.value = worksheet;
}

async function processWorkshopXLSX() {
  const worksheet = workshopFile.value;
  if (!worksheet) return;
  const cwcMap = currentWorkshopColumnMappings.value;

  if (autoGenWId) {
    var lastRow = 1;
    while (true) {
      if (!worksheet.findRow(lastRow)) break;
      lastRow++;
    }
    worksheet.getColumn(worksheet.lastColumn.number + 1).eachCell((cell, rowNum) => cell.value = (lastRow >= rowNum) ? rowNum : null);
  }

  const [readWorkshopData, warnings, error] = readWorkshops(worksheet, new Map(Object.entries({
    [WorkshopColumnType.id]: (autoGenWId) ? worksheet.lastColumn.letter : "A",
    [WorkshopColumnType.leaderName]: colCache.n2l(cwcMap.get(WorkshopColumnType.leaderName)!),
    [WorkshopColumnType.name]: colCache.n2l(cwcMap.get(WorkshopColumnType.name)!),
    [WorkshopColumnType.duration]: colCache.n2l(cwcMap.get(WorkshopColumnType.duration)!),
    [WorkshopColumnType.maxMembers]: colCache.n2l(cwcMap.get(WorkshopColumnType.maxMembers)!),
    [WorkshopColumnType.leaderClass]: colCache.n2l(cwcMap.get(WorkshopColumnType.leaderClass)!)
  })) as Map<WorkshopColumnType, string>);
  if (error) {
    await dialog.message("Beim Einlesen ist ein Fehler aufgetreten:\n" + error, { title: "Fehler beim Einlesen", type: "error" });
    return;
  }
  if (readWorkshopData.size == 0) {
    await dialog.message("Es wurden keine Workshop-Daten in dieser Excel-Datei gefunden!", { title: "Keine Workshop-Daten", type: "error" });
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
    text: "Berechnet Workshopverteilung..."
  });
  await new Promise((d) => window.setTimeout(d, 2000));
  loadW.close();
  step.value++;
}


function saveDoc(what: string) {
  step.value = 4;
}

function startAnew() {
  if (showAnewWarningDialog.value) {
    window.location.reload();
    showAnewWarningDialog.value = false;
  }
  else showAnewWarningDialog.value = true;
}


function updateWColVal(columnType: WorkshopColumnType, newVal: number) {
  if (newVal == -2) currentWorkshopColumnMappings.value.delete(columnType);
  else currentWorkshopColumnMappings.value.set(columnType, newVal);
}

const unusedWColumns = ref<[number, string][]>();
function updateUnusedWColumns(nowVisible = true) {
  if (!nowVisible) return;

  if (!workshopColumnOptions.value) return [];
  const opts = [...workshopColumnOptions.value!.entries()].slice((autoGenWId.value) ? 0 : 1);
  const newUnused = opts.filter((e) => ![...currentWorkshopColumnMappings.value!.values()].includes(e[0]));
  if (newUnused.length > 0) unusedWColumns.value = newUnused;
  else unusedWColumns.value = [[-2, "Auswahl entfernen"]];
}

function isWContinueDisabled() {
  var canContinue = true;
  Object.values(WorkshopColumnType).forEach((val) => {
    if (!currentWorkshopColumnMappings.value.has(val) && val != WorkshopColumnType.id) {
      canContinue = false;
      console.log("didnt have", val);
    }
  });
  console.log("reeval canCont: ", canContinue);
  return !canContinue;
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
      <ElDialog v-model="showAnewWarningDialog">
        Willst du wirklich alle Daten zurücksetzen und von vorne beginnen?
        <template #footer>
          <ElButton type="danger" @click="startAnew">Ja</ElButton>
          <ElButton type="success" @click="() => showAnewWarningDialog = false">Nein</ElButton>
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
      <div v-if="step == 0 && workshopFile === undefined">
        Zuerst musst du <b>die ausgefüllte Excel-Datei mit den Workshopdaten</b> einlesen.<br>
        Bitte vergewissere dich, dass die Daten ähnlich angeordnet sind wie in der Vorlage. Du kannst auch die Daten direkt vom <b>Ergebnisdokument einer LernSax-Umfrage</b> mit den benötigten Daten einlesen.<br>
        <ElButton style="margin-top: 8px;" @click="saveWorkshopTemplate">Vorlage speichern</ElButton><br>
        <ElButton size="large" style="margin-top: 4px;" type="primary" @click="readWorkshopXLSX">Workshopdaten-Excel-Datei auswählen</ElButton>
      </div>
      <div v-else-if="step == 0">
        Bitte wähle den richtigen Inhalt der Spalten für die Verarbeitung aus:
        <table>
          <tr v-for="columnType in Object.values(WorkshopColumnType)">
            <td>Spalte mit {{ columnType }}:</td>
            <td>
              <ElSelect v-if="columnType == WorkshopColumnType.id" disabled :model-value="(autoGenWId) ? 'ID automatisch generiert' : workshopColumnOptions?.get(1)" />
              <ElSelect v-else :model-value="currentWorkshopColumnMappings.get(columnType)" @update:model-value="newVal => updateWColVal(columnType, newVal)" @visible-change="updateUnusedWColumns">
                <ElOption v-for="([column, label]) in unusedWColumns" :value="column" :key="column" :label="label" />
              </ElSelect>
            </td>
          </tr>
        </table>
        <ElButton type="success" :disabled="isWContinueDisabled()" @click="processWorkshopXLSX">Fortfahren</ElButton>
      </div>
      <div style="font-size: smaller;" v-else>
        Infos zu den Workshopdaten:<br>
        <ul>
          <li>Anzahl Workshops: {{ workshopData?.size }}</li>
          <li>Maximale Kapazität aller Workshops: {{ getWorkshopCapacity() }} Schüler</li>
        </ul>
      </div>
    </ElCard>
  </ElContainer>
  <ElFooter style="font-size: small;">
    <ElCard style="width: fit-content; margin-left: -20px; margin-top: 16px;">
      <img src="github-mark-white.svg" height="14" style="vertical-align: auto;"> Quellcode: <a href="#0" @click="() => shell.open('https://github.com/Gamer153/jkg_sf_workshop_gen')">GitHub-Repo von Gamer153</a><br>
      Erstellt von Antonio Albert, 2023<br>
      Fehler, Wünsche oder Probleme? <a href="#1" @click="() => showMailDialog = true">Kontaktiere mich</a>
      <ElDialog v-model="showMailDialog">
        Meine E-Mail-Adresse: <span style="font-family: 'Courier New', Courier, monospace; font-weight: bold; font-size: larger;">a.albert@gamer153.dev</span>
      </ElDialog>
    </ElCard>
    <br>
  </ElFooter>
</template>

<style scoped>
.big-card {
  width: 100%;
  height: 100%;
  min-height: 100%;
}
</style>
