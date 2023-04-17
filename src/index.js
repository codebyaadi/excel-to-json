import XLSX from 'xlsx';

const fileInput = document.getElementById('file-upload');
const convertBtn = document.getElementById('convertBtn');
const output = document.getElementById('output');

function handleFile(e) {
  window.selectedFile = null;
  const files = e.target.files;
  if (files.length === 0) return;
  const file = files[0];

  // Store the file in a global variable for later use
  window.selectedFile = file;
  console.log(file);

  // Show the file name
  const fileNameLabel = document.getElementById('file-name');
  fileNameLabel.textContent = file.name;

  // Show the file container
  const selectedFile = document.getElementById('selected-file');
  selectedFile.classList.remove('hidden');
}

fileInput.addEventListener('change', handleFile);

convertBtn.addEventListener('click', function() {
  // Show the loading spinner
  const loading = document.getElementById('loading');
  loading.style.display = 'flex';
  if (!window.selectedFile) return;
  const file = window.selectedFile;

  // Read the file as a binary string
  const reader = new FileReader();
  reader.readAsBinaryString(file);

  reader.onload = function(e) {
    const data = e.target.result;

    // Convert the binary string to a workbook object
    const workbook = XLSX.read(data, { type: 'binary' });

    // Get the first worksheet from the workbook
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the worksheet to a JSON object
    const json = XLSX.utils.sheet_to_json(worksheet);

    // Display the JSON data
    output.innerText = JSON.stringify(json, null, 2);
    downloadBtn.style.display = 'inline';

    // Hide the loading spinner
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    // Remove the 'hidden' class from the 'pre' tag
    output.classList.remove('hidden');
  };
});

downloadBtn.addEventListener('click', function() {
  const json = output.innerText;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "output.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
});
