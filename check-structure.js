const fs = require('fs');
const path = require('path');

// Expected directory structure
const expectedStructure = {
  'css': ['style.css', 'auth.css'],
  'js': {
    'modules': [],
    'utils': ['dom.js', 'storage.js', 'api.js'],
    'services': ['authService.js', 'taskService.js'],
    'components': []
  },
  'images': [],
  'dashboard.html': 'file',
  'login.html': 'file',
  'js/app.js': 'file',
  'js/config.js': 'file'
};

function checkStructure(basePath, structure, prefix = '') {
  console.log(`\nChecking structure in: ${prefix || 'root'}`);
  
  for (const [item, contents] of Object.entries(structure)) {
    const fullPath = path.join(basePath, item);
    const displayPath = path.join(prefix, item);
    
    if (contents === 'file') {
      const exists = fs.existsSync(fullPath);
      console.log(`  ${exists ? '✓' : '✗'} ${displayPath}`);
      if (!exists) {
        console.error(`    ERROR: Missing file: ${displayPath}`);
      }
      continue;
    }
    
    // It's a directory
    const isDir = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
    console.log(`  ${isDir ? '✓' : '✗'} ${displayPath}/`);
    
    if (!isDir) {
      console.error(`    ERROR: Missing directory: ${displayPath}/`);
      continue;
    }
    
    // Recursively check contents if it's a directory with contents
    if (Array.isArray(contents)) {
      const dirContents = fs.readdirSync(fullPath);
      contents.forEach(file => {
        const fileExists = dirContents.includes(file);
        console.log(`    ${fileExists ? '✓' : '✗'} ${file}`);
        if (!fileExists) {
          console.error(`      ERROR: Missing file: ${path.join(displayPath, file)}`);
        }
      });
    } else if (typeof contents === 'object') {
      checkStructure(fullPath, contents, displayPath);
    }
  }
}

// Run the check
console.log('\n=== Checking Project Structure ===');
checkStructure(__dirname, expectedStructure);
console.log('\n=== Structure Check Complete ===\n');

// Check for common issues
console.log('\nChecking for common issues...');

// Check if dashboard.html has correct CSS links
const dashboardContent = fs.readFileSync('dashboard.html', 'utf8');
const hasStyleCSS = dashboardContent.includes('href="css/style.css"');
const hasAuthCSS = dashboardContent.includes('href="css/auth.css"');

console.log(`\nCSS Links in dashboard.html:`);
console.log(`  ${hasStyleCSS ? '✓' : '✗'} css/style.css`);
console.log(`  ${hasAuthCSS ? '✓' : '✗'} css/auth.css`);

// Check if app.js is properly included
const hasAppJS = dashboardContent.includes('src="js/app.js"');
console.log(`\nJavaScript Modules in dashboard.html:`);
console.log(`  ${hasAppJS ? '✓' : '✗'} js/app.js (type="module")`);

// Check if required CDN dependencies are loaded
const hasFontAwesome = dashboardContent.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome');
const hasFullCalendarCSS = dashboardContent.includes('cdn.jsdelivr.net/npm/fullcalendar');
const hasFullCalendarJS = dashboardContent.includes('fullcalendar@5');
const hasChartJS = dashboardContent.includes('cdn.jsdelivr.net/npm/chart.js');

console.log('\nCDN Dependencies:');
console.log(`  ${hasFontAwesome ? '✓' : '✗'} Font Awesome`);
console.log(`  ${hasFullCalendarCSS ? '✓' : '✗'} FullCalendar CSS`);
console.log(`  ${hasFullCalendarJS ? '✓' : '✗'} FullCalendar JS`);
console.log(`  ${hasChartJS ? '✓' : '✗'} Chart.js`);

// Provide next steps
console.log('\nNext Steps:');
console.log('1. Open login.html to access the application');
console.log('2. Use these test credentials:');
console.log('   - Email: siddhartha@example.com');
console.log('   - Password: password');
console.log('3. After login, you will be redirected to dashboard.html');
