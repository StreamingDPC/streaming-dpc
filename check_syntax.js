
> admin.html:11:    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  admin.html:12:    <style>
  admin.html:13:        .admin-layout {
  admin.html:14:            padding: 2rem 1rem;
  admin.html:15:            max-width: 1000px;
  admin.html:16:            margin: 0 auto;
  admin.html:17:        }
  admin.html:18:
  admin.html:19:        .admin-header {
  admin.html:20:            display: flex;
  admin.html:21:            justify-content: space-between;
  admin.html:22:            align-items: center;
  admin.html:23:            margin-bottom: 2rem;
  admin.html:24:        }
  admin.html:25:
  admin.html:26:        .logout-btn {
  admin.html:27:            background: #ff4d4d;
  admin.html:28:            border: none;
  admin.html:29:            padding: 0.5rem 1rem;
  admin.html:30:            border-radius: 8px;
  admin.html:31:            color: white;
  admin.html:32:            cursor: pointer;
  admin.html:33:            font-family: inherit;
  admin.html:34:        }
  admin.html:35:
  admin.html:36:        .admin-tabs {
  admin.html:37:            display: flex;
  admin.html:38:            gap: 1rem;
  admin.html:39:            margin-bottom: 2rem;
  admin.html:40:            border-bottom: 1px solid var(--glass-border);
  admin.html:41:            padding-bottom: 1rem;
  admin.html:42:        }
  admin.html:43:
  admin.html:44:        .admin-tab {
  admin.html:45:            background: none;
  admin.html:46:            border: none;
  admin.html:47:            color: white;
  admin.html:48:            padding: 0.5rem 1rem;
  admin.html:49:            cursor: pointer;
  admin.html:50:            font-size: 1.1rem;
  admin.html:51:            font-weight: 600;
  admin.html:52:            border-radius: 8px;
  admin.html:53:            transition: all 0.3s ease;
  admin.html:54:        }
  admin.html:55:
  admin.html:56:        .admin-tab.active {
  admin.html:57:            background: var(--text-primary);
  admin.html:58:            color: var(--bg-dark);
  admin.html:59:        }
  admin.html:60:
  admin.html:61:        .tab-content {
  admin.html:62:            display: none;
  admin.html:63:        }
  admin.html:64:
  admin.html:65:        .tab-content.active {
  admin.html:66:            display: block;
  admin.html:67:        }
  admin.html:68:
  admin.html:69:        .admin-form {
  admin.html:70:            background: var(--bg-card);
  admin.html:71:            padding: 1.5rem;
  admin.html:72:            border-radius: 20px;
  admin.html:73:            border: 1px solid var(--glass-border);
  admin.html:74:            margin-bottom: 2rem;
  admin.html:75:        }
  admin.html:76:
  admin.html:77:        .form-grid {
  admin.html:78:            display: grid;
  admin.html:79:            grid-template-columns: 1fr 1fr;
  admin.html:80:            gap: 1rem;
  admin.html:81:            margin-bottom: 1rem;
  admin.html:82:        }
  admin.html:83:
  admin.html:84:        .form-col {
  admin.html:85:            display: flex;
  admin.html:86:            flex-direction: column;
  admin.html:87:            gap: 0.5rem;
  admin.html:88:        }
  admin.html:89:
  admin.html:90:        .form-col label {
  admin.html:91:            font-size: 0.9rem;
  admin.html:92:            color: #ccc;
  admin.html:93:        }
  admin.html:94:
  admin.html:95:        input,
  admin.html:96:        select,
  admin.html:97:        textarea {
  admin.html:98:            width: 100%;
  admin.html:99:            padding: 0.8rem;
  admin.html:100:            border-radius: 12px;
  admin.html:101:            border: 1px solid var(--glass-border);
  admin.html:102:            background: var(--glass);
  admin.html:103:            color: white;
  admin.html:104:            font-family: inherit;
  admin.html:105:        }
  admin.html:106:
  admin.html:107:        select option {
  admin.html:108:            background-color: var(--bg-dark, #050507);
  admin.html:109:            color: white;
  admin.html:110:        }
  admin.html:111:
  admin.html:112:        textarea {
  admin.html:113:            resize: vertical;
  admin.html:114:            min-height: 120px;
  admin.html:115:        }
  admin.html:116:
  admin.html:117:        .save-btn {
  admin.html:118:            width: 100%;
  admin.html:119:            padding: 1rem;
  admin.html:120:            border-radius: 12px;
  admin.html:121:            border: none;
  admin.html:122:            background: var(--text-primary);
  admin.html:123:            color: var(--bg-dark);
  admin.html:124:            font-weight: 700;
  admin.html:125:            cursor: pointer;
  admin.html:126:            margin-top: 1rem;
  admin.html:127:        }
  admin.html:128:
  admin.html:129:        .btn-cancel {
  admin.html:130:            width: 100%;
  admin.html:131:            padding: 1rem;
  admin.html:132:            border-radius: 12px;
  admin.html:133:            border: 1px solid var(--glass-border);
  admin.html:134:            background: transparent;
  admin.html:135:            color: white;
  admin.html:136:            font-weight: 700;
  admin.html:137:            cursor: pointer;
  admin.html:138:            margin-top: 0.5rem;
  admin.html:139:            display: none;
  admin.html:140:        }
  admin.html:141:
  admin.html:142:        .admin-list {
  admin.html:143:            margin-top: 1rem;
  admin.html:144:            max-height: 500px;
  admin.html:145:            overflow-y: auto;
  admin.html:146:        }
  admin.html:147:
  admin.html:148:        .admin-item {
  admin.html:149:            display: grid;
  admin.html:150:            grid-template-columns: auto 1fr auto;
  admin.html:151:            align-items: center;
  admin.html:152:            gap: 1rem;
  admin.html:153:            padding: 1rem;
  admin.html:154:            border-bottom: 1px solid var(--glass-border);
  admin.html:155:            background: var(--glass);
  admin.html:156:            margin-bottom: 0.5rem;
  admin.html:157:            border-radius: 12px;
  admin.html:158:        }
  admin.html:159:
  admin.html:160:        .admin-item.inactive {
  admin.html:161:            opacity: 0.5;
  admin.html:162:            background: rgba(0, 0, 0, 0.5);
  admin.html:163:        }
  admin.html:164:
  admin.html:165:        .item-actions {
  admin.html:166:            display: flex;
  admin.html:167:            gap: 0.5rem;
  admin.html:168:        }
  admin.html:169:
  admin.html:170:        .btn-icon {
  admin.html:171:            background: var(--glass);
  admin.html:172:            border: 1px solid var(--glass-border);
  admin.html:173:            color: white;
  admin.html:174:            width: 35px;
  admin.html:175:            height: 35px;
  admin.html:176:            border-radius: 8px;
  admin.html:177:            cursor: pointer;
  admin.html:178:            display: flex;
  admin.html:179:            align-items: center;
  admin.html:180:            justify-content: center;
  admin.html:181:        }
  admin.html:182:
  admin.html:183:        .btn-icon:hover {
  admin.html:184:            background: white;
  admin.html:185:            color: black;
  admin.html:186:        }
  admin.html:187:
  admin.html:188:        .btn-delete:hover {
  admin.html:189:            background: #ff4d4d;
  admin.html:190:            color: white;
  admin.html:191:        }
  admin.html:192:
  admin.html:193:        .btn-edit {
  admin.html:194:            color: #4cd137;
  admin.html:195:        }
  admin.html:196:
  admin.html:197:        .btn-toggle {
  admin.html:198:            color: #f39c12;
  admin.html:199:        }
  admin.html:200:
  admin.html:201:        .search-bar {
  admin.html:202:            margin-bottom: 1rem;
  admin.html:203:            display: flex;
  admin.html:204:            gap: 1rem;
  admin.html:205:        }
  admin.html:206:    </style>
  admin.html:207:    <!-- Firebase SDK Compat -->
> admin.html:208:    <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"></script>
> admin.html:209:    <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-database-compat.js"></script>
> admin.html:210:    <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-auth-compat.js"></script>
> admin.html:211:    <script>
  admin.html:212:        // Init firebase only for auth check at the head
  admin.html:213:        const fwConfig = {
  admin.html:214:            apiKey: "AIzaSyBscP8FT1dcnHlSFMXc3DlfXSgRO9ET9s4",
  admin.html:215:            authDomain: "streamingdpc-7e7fa.firebaseapp.com",
  admin.html:216:            databaseURL: "https://streamingdpc-7e7fa-default-rtdb.firebaseio.com",
  admin.html:217:            projectId: "streamingdpc-7e7fa",
  admin.html:218:            storageBucket: "streamingdpc-7e7fa.firebasestorage.app",
  admin.html:219:            messagingSenderId: "831116907849",
  admin.html:220:            appId: "1:831116907849:web:ee8e744db342970fd0b698"
  admin.html:221:        };
  admin.html:222:        if (!firebase.apps.length) {
  admin.html:223:            firebase.initializeApp(fwConfig);
  admin.html:224:        }
  admin.html:225:        
  admin.html:226:        firebase.auth().onAuthStateChanged((user) => {
  admin.html:227:            if (!user) {
  admin.html:228:                // Kick out unauthenticated access
  admin.html:229:                window.location.href = 'login.html';
  admin.html:230:            }
  admin.html:231:        });
  admin.html:232:
  admin.html:233:        // Ensure original logout overrides clear firebase session
  admin.html:234:        window.logout = function() {
  admin.html:235:            firebase.auth().signOut().then(() => {
  admin.html:236:                window.location.href = 'login.html';
  admin.html:237:            });
  admin.html:238:        };
  admin.html:239:    </script>
> admin.html:240:    <script>
  admin.html:241:        window.openWhatsapp = function(phone, text) {
  admin.html:242:            let encodedText = encodeURIComponent(text);
  admin.html:243:            let url = (phone && phone !== 'null' && phone !== 'undefined') ? 'https://wa.me/' + phone 
+ '?text=' + encodedText : 'https://wa.me/?text=' + encodedText;
  admin.html:244:            window.open(url, '_blank');
  admin.html:245:        }
  admin.html:246:    </script>
  admin.html:247:</head>
  admin.html:248:
  admin.html:249:<body>
  admin.html:250:    <div class="admin-layout">
  admin.html:251:        <div class="admin-header">
  admin.html:252:            <h1>Panel de Control <span style="font-size: 0.8rem; color:#4cd137;">v3.9.23 (Stats 
Export)</span></h1>
  admin.html:253:            <div style="display: flex; gap: 0.5rem;">
  admin.html:254:                <button class="logout-btn" style="background: #2e86de;" 
onclick="location.reload()"><i class="fa-solid fa-arrows-rotate"></i> Actualizar</button>
  admin.html:255:                <button class="logout-btn" onclick="logout()"><i class="fa-solid 
fa-right-from-bracket"></i> Salir</button>
  admin.html:256:            </div>
  admin.html:257:        </div>
  admin.html:258:
  admin.html:259:        <div class="admin-tabs">
  admin.html:260:            <button class="admin-tab active" onclick="switchTab('productos', this)">📦 
Productos</button>
  admin.html:261:            <button class="admin-tab" onclick="switchTab('estrenos', this)">🎬 Estrenos</button>
  admin.html:262:            <button class="admin-tab" onclick="switchTab('banners', this)">🖼️ Banners</button>
  admin.html:263:            <button class="admin-tab" onclick="switchTab('vendedores', this)">👔 Vendedores</button>
  admin.html:264:            <button class="admin-tab" onclick="switchTab('clientes', this)">👥 Clientes</button>
  admin.html:265:            <button class="admin-tab" onclick="switchTab('ventas', this)">📈 Ventas</button>
  admin.html:266:            <button class="admin-tab" onclick="switchTab('stats', this); renderStats();">📊 
Estadísticas</button>
  admin.html:267:            <button class="admin-tab" onclick="switchTab('crm', this)">💬 Respuestas CRM</button>
  admin.html:268:            <button class="admin-tab" onclick="switchTab('polla', this)" style="border: 1px solid 
rgba(76, 209, 55, 0.4);"><i class="fa-solid fa-trophy" style="color: #4cd137;"></i> Polla</button>
  admin.html:269:            <button class="admin-tab" onclick="switchTab('configuracion', this)">⚙️ 
Configuración</button>
  admin.html:270:        </div>
  admin.html:271:
  admin.html:272:        <!-- TAB PRODUCTOS -->
  admin.html:273:        <div id="tab-productos" class="tab-content active">
  admin.html:274:            <div class="admin-form">
  admin.html:275:                <h3 id="form-title">Agregar Nuevo Producto</h3>
  admin.html:276:                <div class="form-grid">
  admin.html:277:                    <div class="form-col">
  admin.html:278:                        <label>Nombre del Producto</label>
  admin.html:279:                        <input type="text" id="new-name" placeholder="Ej: Netflix Premium 1 Pantalla">
  admin.html:280:                    </div>
  admin.html:281:                    <div class="form-col">
  admin.html:282:                        <label>Precio ($)</label>
  admin.html:283:                        <input type="number" id="new-price" placeholder="Ej: 16000">
  admin.html:284:                    </div>
  admin.html:285:                    <div class="form-col">
  admin.html:286:                        <label>Precio Mayorista/Vendedor ($)</label>
  admin.html:287:                        <input type="number" id="new-seller-price" placeholder="Ej: 14000 (Opcional)">
  admin.html:288:                    </div>
  admin.html:289:                    <div class="form-col">
  admin.html:290:                        <label style="color: #f39c12; font-weight: bold;">Precio de Compra / Costo 
($)</label>
  admin.html:291:                        <input type="number" id="new-purchase-price" placeholder="Ej: 8000 (Para 
ganancias)" style="border: 1px solid #f39c12;">
  admin.html:292:                    </div>
  admin.html:293:                    <div class="form-col">
  admin.html:294:                        <label>Categoría</label>
  admin.html:295:                        <select id="new-category">
  admin.html:296:                            <option value="individual">Individual</option>
  admin.html:297:                            <option value="combos2">Combo 2</option>
  admin.html:298:                            <option value="combos3">Combo 3</option>
  admin.html:299:                            <option value="combos4">Combo 4</option>
  admin.html:300:                            <option value="combos5">Combo 5</option>
  admin.html:301:                            <option value="ventas_extras">Ventas Extras (Admin y Vendedores)</option>
  admin.html:302:                            <option value="promociones_finde">Promoción fin de semana</option>
  admin.html:303:                            <option value="promociones">Promociones del mes</option>
  admin.html:304:                        </select>
  admin.html:305:                    </div>
  admin.html:306:                    <div class="form-col" id="owner-col" style="display:none;">
  admin.html:307:                        <label>Vendedor Dueño (solo Ventas Extras)</label>
  admin.html:308:                        <select id="new-owner">
  admin.html:309:                            <option value="admin">Administrador (Global)</option>
  admin.html:310:                        </select>
  admin.html:311:                    </div>
  admin.html:312:                    <div class="form-col">
  admin.html:313:                        <label>Marca (para Autocompletar Logo)</label>
  admin.html:314:                        <input type="text" id="new-brand" placeholder="Ej: Netflix, Combo, Disney+">
  admin.html:315:                    </div>
  admin.html:316:                    <div class="form-col" style="grid-column: span 2;">
  admin.html:317:                        <label>Descripción Corta (Predeterminado: Pantalla original premium con 
garantía.)</label>
  admin.html:318:                        <input type="text" id="new-desc" placeholder="Pantalla original premium con 
garantía.">
  admin.html:319:                    </div>
  admin.html:320:                    <div class="form-col" style="grid-column: span 2;">
  admin.html:321:                        <label>Imagen Personalizada (Ruta, URL, o Archivo Local)</label>
  admin.html:322:                        <div style="display:flex; gap: 0.5rem; flex-wrap: wrap;">
  admin.html:323:                            <input type="text" id="new-image" placeholder="Ruta local (assets/...) o 
URL" style="flex:1;">
  admin.html:324:                            <input type="file" id="new-image-file" accept="image/*" 
style="display:none;" onchange="
  admin.html:325:                                if(this.files && this.files[0]){
  admin.html:326:                                    if(this.files[0].size > 500000) return alert('La imagen es muy 
pesada. Debe ser menor a 500KB.');
  admin.html:327:                                    const r = new FileReader(); r.onload = e => 
document.getElementById('new-image').value = e.target.result;
  admin.html:328:                                    r.readAsDataURL(this.files[0]);
  admin.html:329:                                }
  admin.html:330:                            ">
  admin.html:331:                            <button type="button" class="btn-icon" style="width: auto; padding: 0 
1rem; border-radius: 12px; font-size: 0.9rem;" onclick="document.getElementById('new-image-file').click()"><i 
class="fa-solid fa-upload"></i> Archivo Local</button>
  admin.html:332:                        </div>
  admin.html:333:                        <p style="font-size: 0.8rem; color: #a0a0a0; margin-top: 0.3rem;">
  admin.html:334:                            * Si dejas esto vacío, el sistema intentará asignar un logo 
automáticamente basado en la
  admin.html:335:                            Marca.
  admin.html:336:                        </p>
  admin.html:337:                    </div>
  admin.html:338:                    <div class="form-col">
  admin.html:339:                        <label>Cantidad en Stock (Opcional, 0 = Sin límite)</label>
  admin.html:340:                        <input type="number" id="new-stock" placeholder="Ej: 5" value="0">
  admin.html:341:                    </div>
  admin.html:342:                    <div class="form-col" style="grid-column: 1 / -1; border-top: 1px solid 
var(--glass-border); padding-top: 1rem;">
  admin.html:343:                        <label>Habilitar para Renovación (Incluso Agotado)</label>
  admin.html:344:                        <input type="text" id="search-allow-exhausted" placeholder="🔍 Buscar 
vendedor o cliente..." oninput="filterAllowExhausted()" style="margin-bottom: 0.5rem; background: var(--glass); color: 
white;">
  admin.html:345:                        <select id="new-allow-exhausted-seller" multiple style="height: auto; 
min-height: 120px;">
  admin.html:346:                            <option value="">-- Ninguno --</option>
  admin.html:347:                        </select>
  admin.html:348:                        <p style="font-size: 0.8rem; color: #a0a0a0; margin-top: 0.3rem;">Mantén 
presionado 'Ctrl' o 'Cmd' para seleccionar varios.</p>
  admin.html:349:                        
  admin.html:350:                        <div style="display:flex; gap:1rem; margin-top: 1rem; align-items:flex-start; 
flex-wrap:wrap;">
  admin.html:351:                            <div style="flex:1; min-width: 120px;">
  admin.html:352:                                <label style="font-size: 0.85rem; color:white;">Stock Reservado 
(Cant. por usuario)</label>
  admin.html:353:                                <input type="number" id="new-allow-exhausted-stock" placeholder="Ej: 
1" style="margin-top:0.3rem;">
  admin.html:354:                                <small style="color:#ccc;">Vacío para ilimitado, o ingresa el 
límite.</small>
  admin.html:355:                            </div>
  admin.html:356:                            <div style="flex:1; min-width: 150px;">
  admin.html:357:                                <label style="font-size: 0.85rem; color:white;">Fecha de Vencimiento 
de este stock</label>
  admin.html:358:                                <input type="date" id="new-allow-exhausted-date" 
style="margin-top:0.3rem;">
  admin.html:359:                                <small style="color:#ccc;">El stock se reiniciará si supera esta 
fecha.</small>
  admin.html:360:                            </div>
  admin.html:361:                        </div>
  admin.html:362:                    </div>
  admin.html:363:                </div>
  admin.html:364:
  admin.html:365:                <button class="save-btn" onclick="saveProduct()">Guardar Producto</button>
  admin.html:366:                <button class="btn-cancel" id="btn-cancel" onclick="cancelEdit()">Cancelar 
Edición</button>
  admin.html:367:            </div>
  admin.html:368:
  admin.html:369:            <div class="admin-form">
  admin.html:370:                <h3>Gestionar Productos</h3>
  admin.html:371:                <div class="search-bar">
  admin.html:372:                    <input type="text" id="search-prod" placeholder="🔍 Buscar por nombre..."
  admin.html:373:                        onkeyup="renderAdminList()">
  admin.html:374:                    <select id="filter-cat" onchange="renderAdminList()">
  admin.html:375:                        <option value="all">Todas las categorías</option>
  admin.html:376:                        <option value="individual">Individuales</option>
  admin.html:377:                        <option value="combos2">Combos 2</option>
  admin.html:378:                        <option value="combos3">Combos 3</option>
  admin.html:379:                        <option value="combos4">Combos 4</option>
  admin.html:380:                        <option value="combos5">Combos 5</option>
  admin.html:381:                        <option value="ventas_extras">Ventas Extras (Asignadas a Vendedores)</option>
  admin.html:382:                        <option value="promociones_finde">Promociones fin de semana</option>
  admin.html:383:                        <option value="promociones">Promociones del mes</option>
  admin.html:384:                    </select>
  admin.html:385:                </div>
  admin.html:386:                <div id="admin-list" class="admin-list">
  admin.html:387:                    <!-- Se llenará con JS -->
  admin.html:388:                </div>
  admin.html:389:            </div>
  admin.html:390:        </div>
  admin.html:391:
  admin.html:392:        <!-- TAB ESTRENOS -->
  admin.html:393:        <div id="tab-estrenos" class="tab-content">
  admin.html:394:            <div class="admin-form">
  admin.html:395:                <h3 id="estreno-form-title">Agregar Película / Estreno</h3>
  admin.html:396:                <div class="form-grid">
  admin.html:397:                    <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:398:                        <label>Título de la Película</label>
  admin.html:399:                        <input type="text" id="new-estreno-title" placeholder="Ej: Deadpool 3">
  admin.html:400:                    </div>
  admin.html:401:                    <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:402:                        <label>Mes de Estreno</label>
  admin.html:403:                        <select id="new-estreno-month">
  admin.html:404:                            <option value="Enero">Enero</option>
  admin.html:405:                            <option value="Febrero">Febrero</option>
  admin.html:406:                            <option value="Marzo">Marzo</option>
  admin.html:407:                            <option value="Abril">Abril</option>
  admin.html:408:                            <option value="Mayo">Mayo</option>
  admin.html:409:                            <option value="Junio">Junio</option>
  admin.html:410:                            <option value="Julio">Julio</option>
  admin.html:411:                            <option value="Agosto">Agosto</option>
  admin.html:412:                            <option value="Septiembre">Septiembre</option>
  admin.html:413:                            <option value="Octubre">Octubre</option>
  admin.html:414:                            <option value="Noviembre">Noviembre</option>
  admin.html:415:                            <option value="Diciembre">Diciembre</option>
  admin.html:416:                            <option value="Otros">Otros</option>
  admin.html:417:                        </select>
  admin.html:418:                    </div>
  admin.html:419:                </div>
  admin.html:420:                <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:421:                    <label>Enlace del Tráiler (YouTube URL embed o link de video Mp4)</label>
  admin.html:422:                    <input type="text" id="new-estreno-url" placeholder="Ej: 
https://www.youtube.com/embed/... ">
  admin.html:423:                </div>
  admin.html:424:                <div style="display:flex; gap:1rem; align-items:center;">
  admin.html:425:                    <button class="save-btn" id="btn-save-estreno" onclick="saveEstreno()" 
style="flex:1;">Guardar
  admin.html:426:                        Estreno</button>
  admin.html:427:                    <button class="save-btn" id="btn-cancel-estreno" onclick="cancelEditEstreno()"
  admin.html:428:                        style="flex:1; background:#ff4d4d; display:none;">Cancelar Edición</button>
  admin.html:429:                </div>
  admin.html:430:            </div>
  admin.html:431:            <div class="admin-form">
  admin.html:432:                <h3>Estrenos Actuales</h3>
  admin.html:433:                <div id="admin-list-estrenos" class="admin-list"></div>
  admin.html:434:            </div>
  admin.html:435:        </div>
  admin.html:436:
  admin.html:437:        <!-- TAB BANNERS -->
  admin.html:438:        <div id="tab-banners" class="tab-content">
  admin.html:439:            <div class="admin-form">
  admin.html:440:                <h3 style="color: #ff416c; margin-bottom: 1rem;"><i class="fa-solid fa-star" 
style="color:#ff416c;"></i>
  admin.html:441:                    Configuración General de Banners Principales</h3>
  admin.html:442:                <p style="font-size:0.85rem; color:#a0a0a0; margin-bottom:1rem;">Muestra un gran 
banner promocional que
  admin.html:443:                    cambia automáticamente en la parte superior de la página para enganchar a los 
clientes. (Máximo
  admin.html:444:                    recomendado: 5)</p>
  admin.html:445:                <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:446:                    <label>Activar Carrusel de Banners Principales</label>
  admin.html:447:                    <select id="conf-mainBannerEnabled" onchange="saveBannerToggle()">
  admin.html:448:                        <option value="false">Apagado</option>
  admin.html:449:                        <option value="true">Activo / Encendido</option>
  admin.html:450:                    </select>
  admin.html:451:                </div>
  admin.html:452:            </div>
  admin.html:453:
  admin.html:454:            <div class="admin-form">
  admin.html:455:                <h3 id="banner-form-title">Agregar Nuevo Banner</h3>
  admin.html:456:                <div class="form-grid">
  admin.html:457:                    <div class="form-col">
  admin.html:458:                        <label>Etiqueta Pequenia (Ej: GRAN ESTRENO)</label>
  admin.html:459:                        <input type="text" id="new-banner-badge" placeholder="Ej: GRAN ESTRENO">
  admin.html:460:                    </div>
  admin.html:461:                    <div class="form-col">
  admin.html:462:                        <label>Título Principal</label>
  admin.html:463:                        <input type="text" id="new-banner-title" placeholder="Ej: Deadpool & 
Wolverine">
  admin.html:464:                    </div>
  admin.html:465:                    <div class="form-col" style="grid-column: 1 / -1;">
  admin.html:466:                        <label>Descripción Corta</label>
  admin.html:467:                        <input type="text" id="new-banner-desc" placeholder="Ej: Ya disponible en 
máxima calidad...">
  admin.html:468:                    </div>
  admin.html:469:                    <div class="form-col" style="grid-column: 1 / -1;">
  admin.html:470:                        <label>URL de la Imagen de Fondo (Horizontal recomendada)</label>
  admin.html:471:                        <input type="text" id="new-banner-image" placeholder="Ej: 
https://.../imagen.jpg">
  admin.html:472:                    </div>
  admin.html:473:                    <div class="form-col">
  admin.html:474:                        <label>Texto del Botón</label>
  admin.html:475:                        <input type="text" id="new-banner-btntext" placeholder="Ej: Ver Estrenos">
  admin.html:476:                    </div>
  admin.html:477:                    <div class="form-col">
  admin.html:478:                        <label>Acción del Botón (Pestaña o Link)</label>
  admin.html:479:                        <input type="text" id="new-banner-btnlink" placeholder="Ej: estrenos (o una 
URL completa)">
  admin.html:480:                    </div>
  admin.html:481:                </div>
  admin.html:482:                <div style="display:flex; gap:1rem; align-items:center;">
  admin.html:483:                    <button class="save-btn" id="btn-save-banner" onclick="saveBanner()" 
style="flex:1;">Guardar
  admin.html:484:                        Banner</button>
  admin.html:485:                    <button class="save-btn" id="btn-cancel-banner" onclick="cancelEditBanner()"
  admin.html:486:                        style="flex:1; background:#ff4d4d; display:none;">Cancelar Edición</button>
  admin.html:487:                </div>
  admin.html:488:            </div>
  admin.html:489:
  admin.html:490:            <div class="admin-form">
  admin.html:491:                <h3>Banners Agregados</h3>
  admin.html:492:                <div id="admin-list-main-banners" class="admin-list"></div>
  admin.html:493:            </div>
  admin.html:494:        </div>
  admin.html:495:
  admin.html:496:        <!-- TAB VENDEDORES -->
  admin.html:497:        <div id="tab-vendedores" class="tab-content">
  admin.html:498:            <div class="admin-form">
  admin.html:499:                <h3>Agregar Nuevo Vendedor</h3>
  admin.html:500:                <div class="form-grid">
  admin.html:501:                    <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:502:                        <label>Nombre o Usuario</label>
  admin.html:503:                        <input type="text" id="new-seller-name" placeholder="Ej: Carlos">
  admin.html:504:                    </div>
  admin.html:505:                    <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:506:                        <label>WhatsApp del Vendedor</label>
  admin.html:507:                        <input type="text" id="new-seller-whatsapp" placeholder="Ej: 573001234567">
  admin.html:508:                    </div>
  admin.html:509:                    <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:510:                        <label>Contraseña</label>
  admin.html:511:                        <input type="text" id="new-seller-pass" placeholder="Ej: pWd123">
  admin.html:512:                    </div>
  admin.html:513:                    <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:514:                        <label>Habilitar Ventas Extras</label>
  admin.html:515:                        <select id="new-seller-extras-enabled">
  admin.html:516:                            <option value="false">No (Inactivo)</option>
  admin.html:517:                            <option value="true">Sí (Activo)</option>
  admin.html:518:                        </select>
  admin.html:519:                    </div>
  admin.html:520:                    <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:521:                        <label>Límite Prod. Extras (Cant.)</label>
  admin.html:522:                        <input type="number" id="new-seller-extras-limit" placeholder="Ej: 5" 
value="0">
  admin.html:523:                    </div>
  admin.html:524:                </div>
  admin.html:525:                <div style="display:flex; gap:1rem; align-items:center;">
  admin.html:526:                    <button class="save-btn" id="btn-save-seller" onclick="saveSeller()" 
style="flex:1;">Añadir
  admin.html:527:                        Vendedor</button>
  admin.html:528:                    <button class="save-btn" id="btn-cancel-seller" onclick="cancelEditSeller()"
  admin.html:529:                        style="flex:1; background:#ff4d4d; display:none;">Cancelar Edición</button>
  admin.html:530:                </div>
  admin.html:531:            </div>
  admin.html:532:            <div class="admin-form">
  admin.html:533:                <h3>Vendedores Autorizados</h3>
  admin.html:534:                <div id="admin-list-sellers" class="admin-list"></div>
  admin.html:535:            </div>
  admin.html:536:        </div>
  admin.html:537:
  admin.html:538:        <!-- TAB VENTAS (Vendedores) -->
  admin.html:539:        <div id="tab-ventas" class="tab-content">
  admin.html:540:            <div class="admin-form">
  admin.html:541:                <div
  admin.html:542:                    style="display:flex; justify-content:space-between; align-items:flex-start; 
margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
  admin.html:543:                    <div>
  admin.html:544:                        <h3 style="margin-bottom:0;">Ventas de Vendedores & Recordatorios</h3>
  admin.html:545:                        <p style="font-size:0.85rem; color:#a0a0a0; margin-top:0.3rem;">Visualiza las 
ventas de cada
  admin.html:546:                            vendedor y envíales un recordatorio de vencimiento para que contacten a 
sus clientes.</p>
  admin.html:547:                    </div>
  admin.html:548:                    <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
  admin.html:549:                        <input type="text" id="search-ventas-vendedores" placeholder="🔍 Buscar 
vendedor o cliente..." class="input-modern" style="margin-bottom:0; min-width: 250px;" 
oninput="renderSellerSalesStats()">
  admin.html:550:                        <button class="save-btn" onclick="deleteSelectedSellerSales()"
  admin.html:551:                            style="background:#ff4d4d; margin:0; width:auto; padding: 8px 15px; 
font-size:0.9rem;"><i
  admin.html:552:                                class="fa-solid fa-trash"></i> Eliminar Selección</button>
  admin.html:553:                    </div>
  admin.html:554:                </div>
  admin.html:555:                <div id="admin-list-sellers-stats" class="admin-list"></div>
  admin.html:556:            </div>
  admin.html:557:        </div>
  admin.html:558:
  admin.html:559:        <!-- TAB CLIENTES -->
  admin.html:560:        <div id="tab-clientes" class="tab-content">
  admin.html:561:            <div class="admin-form">
  admin.html:562:                <h3 style="color:var(--text-primary);"><i class="fa-solid fa-user-plus"></i> Crear 
Cliente Nuevo Manualmente</h3>
  admin.html:563:                <div class="form-grid">
  admin.html:564:                    <div class="form-col">
  admin.html:565:                        <label>Nombre del Cliente</label>
  admin.html:566:                        <input type="text" id="manual-client-name" placeholder="Ej: Juan Pérez">
  admin.html:567:                    </div>
  admin.html:568:                    <div class="form-col">
  admin.html:569:                        <label>Teléfono Celular</label>
  admin.html:570:                        <input type="text" id="manual-client-phone" placeholder="Ej: 3001234567">
  admin.html:571:                    </div>
  admin.html:572:                    <div class="form-col">
  admin.html:573:                        <label>PIN de Acceso</label>
  admin.html:574:                        <input type="text" id="manual-client-pin" placeholder="Opcional. Ej: 1234">
  admin.html:575:                    </div>
  admin.html:576:
  admin.html:577:                    <div class="form-col">
  admin.html:578:                        <label>Vendedor Asignado (Opcional)</label>
  admin.html:579:                        <select id="manual-client-seller" style="width: 100%; padding: 0.8rem; 
border-radius: 12px; border: 1px solid var(--glass-border); background: var(--bg-dark); color: white;">
  admin.html:580:                             <option value="Página Web Oficial">Página Web Oficial (Admin)</option>
  admin.html:581:                        </select>
  admin.html:582:                    </div>
  admin.html:583:                    <div class="form-col">
  admin.html:584:                        <label>Fecha Inicio (Opcional)</label>
  admin.html:585:                        <input type="date" id="manual-client-start-date" style="width: 100%; padding: 
0.8rem; border-radius: 12px; border: 1px solid var(--glass-border); background: var(--bg-dark); color: white;">
  admin.html:586:                    </div>
  admin.html:587:                    <div class="form-col">
  admin.html:588:                        <label>Vencimiento (Fecha y Hora)</label>
  admin.html:589:                        <div style="display:flex; gap:0.5rem;">
  admin.html:590:                            <input type="date" id="manual-client-end-date" style="flex:2; padding: 
0.8rem; border-radius: 12px; border: 1px solid var(--glass-border); background: var(--bg-dark); color: white;">
  admin.html:591:                            <input type="time" id="manual-client-end-time" value="23:59" 
style="flex:1; padding: 0.8rem; border-radius: 12px; border: 1px solid var(--glass-border); background: 
var(--bg-dark); color: white;">
  admin.html:592:                        </div>
  admin.html:593:                    </div>
  admin.html:594:                    <div class="form-col" style="grid-column: 1 / -1;">
  admin.html:595:                        <label>Seleccionar Pantalla(s) Inicial(es) a Asignar</label>
  admin.html:596:                        <select id="manual-client-product" multiple style="width: 100%; padding: 
0.8rem; border-radius: 12px; border: 1px solid var(--glass-border); background: var(--bg-dark); color: white; 
min-height: 180px;" onchange="updateManualEmailsUI('manual')"></select>
  admin.html:597:                        <p style="font-size:0.8rem; color:#a0a0a0; margin-top:0.3rem;">Mantén 
presionada la tecla Ctrl (o Cmd en tu teclado) y haz clic para seleccionar varias pantallas al mismo tiempo.</p>
  admin.html:598:                    </div>
  admin.html:599:
  admin.html:600:                    <div id="manual-emails-container" class="form-col" style="grid-column: 1 / -1; 
display:none; border-top: 1px solid var(--glass-border); padding-top: 1rem; margin-top: 1rem;">
  admin.html:601:                        <label style="color: #f39c12; font-weight: bold;"><i class="fa-solid 
fa-user-tag"></i> Configurar Alias y Emails Específicos por Pantalla</label>
  admin.html:602:                        <p style="font-size:0.75rem; color:#a0a0a0; margin-bottom: 1rem;">Asigna un 
nombre/alias personalizado y/ou correos diferentes a cada pantalla para el CRM.</p>
  admin.html:603:                        <div id="manual-emails-list" style="display: flex; flex-direction: column; 
gap: 15px;"></div>
  admin.html:604:                    </div>
  admin.html:605:                </div>
  admin.html:606:                <button class="save-btn" style="background:#4cd137;" 
onclick="createClientManual()">Crear Cliente y Asignar Pantalla</button>
  admin.html:607:            </div>
  admin.html:608:
  admin.html:609:            <div class="admin-form">
  admin.html:610:                <h3>Buscar y Editar Cliente</h3>
  admin.html:611:                <div class="form-grid">
  admin.html:612:                    <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:613:                        <label>Número de Teléfono del Cliente</label>
  admin.html:614:                        <div style="display:flex; gap:0.5rem;">
  admin.html:615:                            <input type="text" id="search-client-phone" placeholder="Ej: 3001234567" 
style="flex:1;">
  admin.html:616:                            <button class="save-btn" onclick="searchClient()"
  admin.html:617:                                style="margin:0; width:auto; padding:0 20px;"><i
  admin.html:618:                                    class="fa-solid fa-magnifying-glass"></i></button>
  admin.html:619:                        </div>
  admin.html:620:                    </div>
  admin.html:621:                </div>
  admin.html:622:
  admin.html:623:                <div id="client-edit-area"
  admin.html:624:                    style="display:none; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px 
solid var(--glass-border);">
  admin.html:625:                    <div class="form-grid">
  admin.html:626:                        <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:627:                            <label>Nombre o Apodo Guardado:</label>
  admin.html:628:                            <input type="text" id="edit-client-name">
  admin.html:629:                        </div>
  admin.html:630:                        <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:631:                            <label>Ciudad Guardada:</label>
  admin.html:632:                            <input type="text" id="edit-client-city">
  admin.html:633:                        </div>
  admin.html:634:                        <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:635:                            <label>Nuevo Número de Celular (Opcional):</label>
  admin.html:636:                            <input type="text" id="edit-client-phone-new" placeholder="Solo si cambió 
de número">
  admin.html:637:                        </div>
  admin.html:638:                        <div class="form-col" style="margin-bottom: 1rem; grid-column: 1 / -1; 
display:flex; align-items:center; gap:10px; background: rgba(243, 156, 18, 0.1); padding: 5px 10px; border-radius: 
8px; border: 1px solid rgba(243, 156, 18, 0.2);">
  admin.html:639:                            <input type="checkbox" id="edit-client-update-all" style="width:20px; 
height:20px;">
  admin.html:640:                            <label for="edit-client-update-all" style="margin-bottom:0; 
cursor:pointer; font-weight:bold; color:#f39c12;"><i class="fa-solid fa-triangle-exclamation"></i> �Actualizar 
Nombre/Ciudad en TODO el historial? (Marcas solo si es el mismo cliente real)</label>
  admin.html:641:                        </div>
  admin.html:642:                        <div class="form-col" style="margin-bottom: 1rem; grid-column: 1 / -1; 
background: rgba(255,0,0,0.05); padding: 10px; border-radius: 12px; border: 1px solid rgba(255,0,0,0.1);">
  admin.html:643:                            <div style="display:flex; justify-content:space-between; 
align-items:center;">
  admin.html:644:                                <label style="margin-bottom:0;"><i class="fa-solid fa-list-ul"></i> 
Seleccionar Venta del Historial:</label>
  admin.html:645:                                <button onclick="deleteSpecificSale()" class="save-btn" 
id="btn-delete-sale-specific" style="background:#ff4d4d; margin:0; width:auto; padding:8px 15px; font-size:0.85rem; 
border: 1px solid #ff0000; box-shadow: 0 0 10px rgba(255,0,0,0.2);">
  admin.html:646:                                    <i class="fa-solid fa-trash-can"></i> ELIMINAR ESTA VENTA 
COMPLETAMENTE
  admin.html:647:                                </button>
  admin.html:648:                            </div>
  admin.html:649:                            <select id="edit-client-select-sale" style="width: 100%; margin-top: 
10px; padding: 0.8rem; background: rgba(0,0,0,0.8); border: 1px solid var(--glass-border); color: white; 
border-radius: 12px; font-size: 1rem;" onchange="onEditClientSaleChange()"></select>
  admin.html:650:                            <button onclick="openManualCRM()" class="save-btn" 
style="background:var(--accent-primary); color:black; font-weight:bold; margin-top:10px; width:100%; height:45px; 
border-radius:12px; box-shadow:0 4px 15px rgba(155, 89, 182, 0.3);">
  admin.html:651:                                <i class="fa-solid fa-comment-dots"></i> ENVIAR RESPUESTAS (CRM)
  admin.html:652:                            </button>
  admin.html:653:                            <button onclick="sendCapMonthPolicy()" class="save-btn" 
style="background:#10b981; color:white; font-weight:bold; margin-top:10px; width:100%; height:45px; 
border-radius:12px; box-shadow:0 4px 15px rgba(16, 185, 129, 0.3);">
  admin.html:654:                                <i class="fa-brands fa-whatsapp"></i> ENVIAR NUEVA POLÍTICA FECHAS 
(WhatsApp)
  admin.html:655:                            </button>
  admin.html:656:                        </div>
  admin.html:657:                        <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:658:                            <label>Fecha de Inicio:</label>
  admin.html:659:                            <input type="date" id="edit-client-start-date">
  admin.html:660:                        </div>
  admin.html:661:                        <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:662:                            <label>Fecha y Hora de Fin:</label>
  admin.html:663:                            <div style="display:flex; gap:0.5rem;">
  admin.html:664:                                <input type="date" id="edit-client-end-date" style="flex:2;">
  admin.html:665:                                <input type="time" id="edit-client-end-time" value="23:59" 
style="flex:1;">
  admin.html:666:                            </div>
  admin.html:667:                        </div>
  admin.html:668:                        <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:669:                            <label>PIN de Acceso (4 dígitos):</label>
  admin.html:670:                            <input type="text" id="edit-client-pin" placeholder="No asignado aún">
  admin.html:671:                        </div>
  admin.html:672:                        <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:673:                            <label><i class="fa-solid fa-envelope"></i> Email / Correo del 
Cliente:</label>
  admin.html:674:                            <input type="email" id="edit-client-email" 
placeholder="ejemplo@correo.com">
  admin.html:675:                        </div>
  admin.html:676:
  admin.html:677:
  admin.html:678:                        <div id="history-emails-container" class="form-col" style="grid-column: 1 / 
-1; display:none; border-top: 1px solid var(--glass-border); padding-top: 1rem; margin-top: 0.5rem;">
  admin.html:679:                            <label style="color: #f39c12; font-weight: bold;"><i class="fa-solid 
fa-envelope"></i> Configurar Emails para esta Venta Seleccionada:</label>
  admin.html:680:                            <p style="font-size:0.75rem; color:#a0a0a0; margin-bottom: 
0.8rem;">Puedes corregir los correos de cada pantalla para que el CRM use el correcto.</p>
  admin.html:681:                            <div id="history-emails-list" style="display: flex; flex-direction: 
column; gap: 10px;"></div>
  admin.html:682:                        </div>
  admin.html:683:
  admin.html:684:                        <div class="form-col" style="grid-column: 1 / -1; margin-bottom: 1rem; 
border-top: 1px solid var(--glass-border); padding-top: 1rem; margin-top: 1rem;">
  admin.html:685:                            <label><i class="fa-solid fa-cart-plus"></i> Agregar Nuevas Pantallas 
Adicionales a este Cliente:</label>
  admin.html:686:                            
  admin.html:687:                            <label style="margin-top:0.5rem; display:block;">Asignar nueva compra al 
vendedor (Opcional):</label>
  admin.html:688:                            <select id="edit-client-add-seller" style="width: 100%; padding: 0.8rem; 
border-radius: 8px; border: 1px solid var(--glass-border); background: var(--bg-dark); color: white; margin-bottom: 
0.5rem;">
  admin.html:689:                                <option value="Página Web Oficial">Página Web Oficial (Admin)</option>
  admin.html:690:                            </select>
  admin.html:691:
  admin.html:692:                            <select id="edit-client-add-product" multiple style="width: 100%; 
padding: 0.5rem; background: rgba(0,0,0,0.5); border: 1px solid var(--glass-border); color: white; border-radius: 8px; 
min-height: 150px;" onchange="updateManualEmailsUI('edit')"></select>
  admin.html:693:                            <p style="font-size:0.8rem; color:#a0a0a0; margin-top:0.3rem;">Ctrl (o 
Cmd en Mac) para selección múltiple.</p>
  admin.html:694:                            
  admin.html:695:                            <div id="edit-add-emails-container" class="form-col" style="display:none; 
border-top: 1px solid var(--glass-border); padding-top: 1rem; margin-top: 1rem;">
  admin.html:696:                                <label style="color: #f39c12; font-weight: bold;"><i class="fa-solid 
fa-user-tag"></i> Configurar Alias y Emails para estas nuevas pantallas:</label>
  admin.html:697:                                <div id="edit-add-emails-list" style="display: flex; flex-direction: 
column; gap: 15px; margin-top:0.5rem;"></div>
  admin.html:698:                            </div>
  admin.html:699:
  admin.html:700:                            <!-- FECHAS DE LA NUEVA VENTA -->
  admin.html:701:                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; 
margin-top:1rem; padding:0.8rem; background:rgba(243,156,18,0.07); border-radius:10px; border:1px solid 
rgba(243,156,18,0.25);">
  admin.html:702:                                <div class="form-col">
  admin.html:703:                                    <label style="font-size:0.85rem; color:#f39c12;"><i 
class="fa-solid fa-calendar-day"></i> Fecha de Inicio (Nueva Venta):</label>
  admin.html:704:                                    <input type="date" id="edit-new-sale-start-date" 
style="padding:0.7rem; border-radius:10px; border:1px solid rgba(243,156,18,0.4); background:var(--bg-dark); 
color:white;">
  admin.html:705:                                </div>
  admin.html:706:                                <div class="form-col">
  admin.html:707:                                    <label style="font-size:0.85rem; color:#f39c12;"><i 
class="fa-solid fa-calendar-xmark"></i> Vencimiento (Nueva Venta):</label>
  admin.html:708:                                    <div style="display:flex; gap:0.4rem;">
  admin.html:709:                                        <input type="date" id="edit-new-sale-end-date" style="flex:2; 
padding:0.7rem; border-radius:10px; border:1px solid rgba(243,156,18,0.4); background:var(--bg-dark); color:white;">
  admin.html:710:                                        <input type="time" id="edit-new-sale-end-time" value="23:59" 
style="flex:1; padding:0.7rem; border-radius:10px; border:1px solid rgba(243,156,18,0.4); background:var(--bg-dark); 
color:white;">
  admin.html:711:                                    </div>
  admin.html:712:                                </div>
  admin.html:713:                                <p style="grid-column:1/-1; font-size:0.75rem; color:#a0a0a0; 
margin:0;">Si dejas las fechas vacías, se asignará hoy como inicio y +30 días como vencimiento automáticamente.</p>
  admin.html:714:                            </div>
  admin.html:715:
  admin.html:716:                            <button class="save-btn" style="background:#f39c12; margin-top: 1rem; 
width: auto; font-size: 0.9rem;" onclick="addProductsToExistingClient()"><i class="fa-solid fa-plus"></i> Añadir 
Pantallas como Nueva Compra</button>
  admin.html:717:                        </div>
  admin.html:718:                    </div>
  admin.html:719:                    <div style="display:flex; gap:1rem; flex-wrap:wrap;">
  admin.html:720:                        <button class="save-btn" style="background:#4cd137; flex:1;" 
onclick="saveClientEdits()"><i
  admin.html:721:                                class="fa-solid fa-floppy-disk"></i> Guardar Cambios Locales</button>
  admin.html:722:                        <button class="save-btn" style="background:#ff4d4d; flex:1;" 
id="btn-block-client"
  admin.html:723:                            onclick="toggleBlockClient()"><i class="fa-solid fa-ban"></i> Bloquear 
este Celular</button>
  admin.html:724:                    </div>
  admin.html:725:                </div>
  admin.html:726:            </div>
  admin.html:727:            <div class="admin-form">
  admin.html:728:                <h3>Lista de Todos los Clientes Registrados</h3>
  admin.html:729:                <div style="display:flex; gap: 1rem; margin-bottom:1rem; align-items:center; 
flex-wrap:wrap;">
  admin.html:730:                    <input type="text" id="filter-clients-text" placeholder="Buscar por número o 
nombre..."
  admin.html:731:                        class="input-modern" style="margin-bottom:0; flex:1; min-width: 200px;"
  admin.html:732:                        oninput="renderAllClientsList()">
  admin.html:733:                    <button class="save-btn" onclick="deleteSelectedClientSales()"
  admin.html:734:                        style="background:#ff4d4d; margin:0; width:auto; padding: 10px 20px;"><i
  admin.html:735:                            class="fa-solid fa-trash"></i> Eliminar Selección</button>
  admin.html:736:                </div>
  admin.html:737:                <div id="admin-list-all-clients" class="admin-list" style="max-height: 400px; 
overflow-y: auto;"></div>
  admin.html:738:
  admin.html:739:                <h4 style="margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 
1rem;"><i
  admin.html:740:                        class="fa-solid fa-file-csv"></i> Importar Base de Datos (CSV)</h4>
  admin.html:741:                <p style="font-size: 0.85rem; color: #a0a0a0; margin-bottom: 0.5rem;">Carga tu lista 
de clientes pegando
  admin.html:742:                    su Teléfono, Nombre y PIN separados por comas.</p>
  admin.html:743:                <textarea id="import-clients-csv" rows="3" class="input-modern"
  admin.html:744:                    placeholder="Ejemplo:\n3001234567,Juan Perez,1234\n3129876543,Maria 
Lopez,4321"></textarea>
  admin.html:745:                <div style="display:flex; gap: 1rem; margin-top: 0.5rem;">
  admin.html:746:                    <button class="save-btn" onclick="importClientsCSV()"
  admin.html:747:                        style="background:#27ae60; margin:0; width:auto; padding: 10px 20px;"><i
  admin.html:748:                            class="fa-solid fa-upload"></i> Importar Clientes</button>
  admin.html:749:                    <button class="save-btn" onclick="exportClientsCSV()"
  admin.html:750:                        style="background:#2980b9; margin:0; width:auto; padding: 10px 20px;"><i
  admin.html:751:                            class="fa-solid fa-download"></i> Exportar Actuales</button>
  admin.html:752:                </div>
  admin.html:753:            </div>
  admin.html:754:            <div class="admin-form">
  admin.html:755:                <h3>Lista de Celulares Bloqueados</h3>
  admin.html:756:                <div id="admin-list-blocked" class="admin-list"></div>
  admin.html:757:            </div>
  admin.html:758:        </div>
  admin.html:759:
  admin.html:760:        <!-- TAB ESTADISTICAS -->
  admin.html:761:        <div id="tab-stats" class="tab-content">
  admin.html:762:            <div class="admin-form">
  admin.html:763:                <div style="display:flex; justify-content:space-between; align-items:center; 
margin-bottom:1.5rem; flex-wrap:wrap; gap:10px;">
  admin.html:764:                    <div style="display:flex; align-items:center; gap:15px;">
  admin.html:765:                        <h3 style="margin:0;"><i class="fa-solid fa-chart-line"></i> Reporte de 
Rendimiento</h3>
  admin.html:766:                        <button onclick="downloadStatsCSV()" class="save-btn" 
style="background:#27ae60; margin:0; width:auto; padding: 8px 15px; font-size:0.8rem;">
  admin.html:767:                            <i class="fa-solid fa-download"></i> Descargar Reporte CSV
  admin.html:768:                        </button>
  admin.html:769:                    </div>
  admin.html:770:                    <div style="display:flex; gap:10px; align-items:center;">
  admin.html:771:                        <select id="stats-month-filter" onchange="renderStats()" style="width:auto; 
padding:5px 10px;">
  admin.html:772:                            <option value="0">Enero</option><option value="1">Febrero</option><option 
value="2">Marzo</option>
  admin.html:773:                            <option value="3">Abril</option><option value="4">Mayo</option><option 
value="5">Junio</option>
  admin.html:774:                            <option value="6">Julio</option><option value="7">Agosto</option><option 
value="8">Septiembre</option>
  admin.html:775:                            <option value="9">Octubre</option><option 
value="10">Noviembre</option><option value="11">Diciembre</option>
  admin.html:776:                        </select>
  admin.html:777:                        <select id="stats-year-filter" onchange="renderStats()" style="width:auto; 
padding:5px 10px;">
  admin.html:778:                            <option value="2024">2024</option>
  admin.html:779:                            <option value="2025">2025</option>
  admin.html:780:                            <option value="2026">2026</option>
  admin.html:781:                        </select>
  admin.html:782:                    </div>
  admin.html:783:                </div>
  admin.html:784:
  admin.html:785:                <!-- Resumen Cards -->
  admin.html:786:                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 
1fr)); gap:15px; margin-bottom:2rem;">
  admin.html:787:                    <div style="background:rgba(76, 209, 55, 0.1); padding:20px; border-radius:15px; 
border:1px solid rgba(76, 209, 55, 0.2); text-align:center;">
  admin.html:788:                        <p style="margin:0; font-size:0.8rem; color:#ccc; 
text-transform:uppercase;">Ingresos Brutos</p>
  admin.html:789:                        <h2 id="stats-total-income" style="margin:10px 0 0 0; color:#4cd137;">$0</h2>
  admin.html:790:                    </div>
  admin.html:791:                    <div style="background:rgba(231, 76, 60, 0.1); padding:20px; border-radius:15px; 
border:1px solid rgba(231, 76, 60, 0.2); text-align:center;">
  admin.html:792:                        <p style="margin:0; font-size:0.8rem; color:#ccc; 
text-transform:uppercase;">Costos de Compra</p>
  admin.html:793:                        <h2 id="stats-total-cost" style="margin:10px 0 0 0; color:#e74c3c;">$0</h2>
  admin.html:794:                    </div>
  admin.html:795:                    <div style="background:rgba(52, 152, 219, 0.1); padding:20px; border-radius:15px; 
border:1px solid rgba(52, 152, 219, 0.2); text-align:center;">
  admin.html:796:                        <p style="margin:0; font-size:0.8rem; color:#ccc; 
text-transform:uppercase;">Ganancia Neta</p>
  admin.html:797:                        <h2 id="stats-total-profit" style="margin:10px 0 0 0; color:#3498db;">$0</h2>
  admin.html:798:                    </div>
  admin.html:799:                    <div style="background:rgba(241, 196, 15, 0.1); padding:20px; border-radius:15px; 
border:1px solid rgba(241, 196, 15, 0.2); text-align:center;">
  admin.html:800:                        <p style="margin:0; font-size:0.8rem; color:#ccc; 
text-transform:uppercase;">Total Ventas</p>
  admin.html:801:                        <h2 id="stats-total-sales" style="margin:10px 0 0 0; color:#f1c40f;">0</h2>
  admin.html:802:                    </div>
  admin.html:803:                </div>
  admin.html:804:
  admin.html:805:                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; flex-wrap:wrap;">
  admin.html:806:                    <!-- Top Productos -->
  admin.html:807:                    <div class="admin-form" style="margin:0; padding:1.5rem; background: 
rgba(0,0,0,0.2);">
  admin.html:808:                        <h4 style="margin-top:0;"><i class="fa-solid fa-crown" 
style="color:#f1c40f;"></i> Top 5 Productos</h4>
  admin.html:809:                        <div id="stats-top-products" style="display:flex; flex-direction:column; 
gap:10px;">
  admin.html:810:                            <!-- JS Render -->
  admin.html:811:                        </div>
  admin.html:812:                    </div>
  admin.html:813:
  admin.html:814:                    <!-- Desglose por Categoría -->
  admin.html:815:                    <div class="admin-form" style="margin:0; padding:1.5rem; background: 
rgba(0,0,0,0.2);">
  admin.html:816:                        <h4 style="margin-top:0;"><i class="fa-solid fa-layer-group" 
style="color:#3498db;"></i> Ventas por Categoría</h4>
  admin.html:817:                        <canvas id="stats-category-chart" style="max-height: 200px;"></canvas>
  admin.html:818:                    </div>
  admin.html:819:                </div>
  admin.html:820:                
  admin.html:821:                <div class="admin-form" style="margin-top:20px; padding:1.5rem; background: 
rgba(0,0,0,0.2);">
  admin.html:822:                    <h4 style="margin-top:0;"><i class="fa-solid fa-clock-rotate-left"></i> Histórico 
Mensual (Últimos 6 meses)</h4>
  admin.html:823:                    <canvas id="stats-history-chart" style="max-height: 250px;"></canvas>
  admin.html:824:                </div>
  admin.html:825:
  admin.html:826:                <!-- AUDITORIA DE TRANSACCIONES -->
  admin.html:827:                <div class="admin-form" style="margin-top:20px; padding:1.5rem; background: 
rgba(255,77,77,0.03); border: 1px solid rgba(255,77,77,0.15);">
  admin.html:828:                    <div style="display:flex; justify-content:space-between; align-items:center; 
flex-wrap:wrap; gap:10px; margin-bottom:1rem;">
  admin.html:829:                        <h4 style="margin:0; color:#f39c12;"><i class="fa-solid 
fa-magnifying-glass-chart"></i> Auditoría de Transacciones (Anti-Duplicados)</h4>
  admin.html:830:                        <div style="display:flex; gap:8px; flex-wrap:wrap;">
  admin.html:831:                            <input type="text" id="audit-search" placeholder="🔍 Buscar cliente..." 
oninput="renderAuditoria()" style="padding:6px 10px; border-radius:8px; background:rgba(0,0,0,0.4); border:1px solid 
var(--glass-border); color:white; font-size:0.85rem;">
  admin.html:832:                            <select id="audit-source-filter" onchange="renderAuditoria()" 
style="padding:6px 10px; border-radius:8px; background:rgba(0,0,0,0.4); border:1px solid var(--glass-border); 
color:white; font-size:0.85rem;">
  admin.html:833:                                <option value="all">Todas las fuentes</option>
  admin.html:834:                                <option value="clientSales">Solo clientSales</option>
  admin.html:835:                                <option value="sellerSales">Solo sellerSales</option>
  admin.html:836:                                <option value="duplicates">Solo Duplicados</option>
  admin.html:837:                            </select>
  admin.html:838:                            <button onclick="renderAuditoria()" class="save-btn" style="margin:0; 
width:auto; padding:6px 14px; font-size:0.85rem; background:#f39c12;"><i class="fa-solid fa-rotate"></i> 
Refrescar</button>
  admin.html:839:                        </div>
  admin.html:840:                    </div>
  admin.html:841:                    <p style="font-size:0.8rem; color:#f39c12; margin-bottom:1rem; 
background:rgba(243,156,18,0.08); padding:8px 12px; border-radius:8px; border-left:3px solid #f39c12;">
  admin.html:842:                        <i class="fa-solid fa-triangle-exclamation"></i> <strong>Nota:</strong> Cada 
venta se guarda en <code>clientSales</code> (indexado por celular) <strong>y</strong> en <code>sellerSales</code> 
(indexado por vendedor). Las estadísticas solo cuentan <code>clientSales</code> para evitar doble conteo. Esta tabla 
te muestra AMBAS fuentes para que identifiques registros extra. Los marcados en <span 
style="color:#ff4d4d;">rojo</span> son posibles duplicados (misma fecha + mismo teléfono).
  admin.html:843:                    </p>
  admin.html:844:                    <div id="audit-summary" style="display:grid; 
grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; margin-bottom:1rem;"></div>
  admin.html:845:                    <div id="audit-list" style="max-height:500px; overflow-y:auto; display:flex; 
flex-direction:column; gap:6px;">
  admin.html:846:                        <p style="color:#777; text-align:center;">Haz clic en “Refrescar” o abre esta 
sección para cargar los datos.</p>
  admin.html:847:                    </div>
  admin.html:848:                </div>
  admin.html:849:            </div>
  admin.html:850:        </div>
  admin.html:851:
  admin.html:852:        <!-- TAB CRM / RESPUESTAS -->
  admin.html:853:        <div id="tab-crm" class="tab-content">
  admin.html:854:            <div class="admin-form" style="padding-bottom: 2rem;">
  admin.html:855:                <h2><i class="fa-solid fa-comment-dots" style="color:var(--accent-primary);"></i> 
Respuestas y Mensajes CRM</h2>
  admin.html:856:                <p style="color:#a0a0a0; margin-bottom:1.5rem;">Configura las plantillas de mensajes 
y las guías visuales que se envían por WhatsApp.</p>
  admin.html:857:
  admin.html:858:                <!-- TOGGLE CRM ACTIVADO -->
  admin.html:859:                <div style="background: rgba(155, 89, 182, 0.1); border: 2px solid #9b59b6; 
border-radius: 12px; padding: 1.2rem; margin-bottom: 1.5rem;">
  admin.html:860:                    <label style="color:#9b59b6; font-weight:bold; font-size: 1.1rem; display:block; 
margin-bottom:0.5rem;"><i class="fa-solid fa-toggle-on"></i> ACTIVAR SISTEMA DE RESPUESTAS (CRM)</label>
  admin.html:861:                    <p style="font-size: 0.85rem; color: #ccc; margin-bottom: 1rem;">Habilita el 
panel de respuestas automáticas y guías visuales para tus clientes.</p>
  admin.html:862:                    <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:863:                        <select id="main-conf-crmEnabled" style="flex:1; border:1px solid #9b59b6; 
background: #000; color: white; padding: 10px; border-radius: 8px;">
  admin.html:864:                            <option value="true">SÍ - ACTIVAR CRM</option>
  admin.html:865:                            <option value="false">NO - DESACTIVAR CRM</option>
  admin.html:866:                        </select>
  admin.html:867:                        <button class="save-btn" onclick="saveConfig()"
  admin.html:868:                            style="margin:0; padding:10px 20px; width:auto; background:#9b59b6; 
color: white; font-weight: bold; border-radius: 8px;"
  admin.html:869:                            title="Guardar"><i class="fa-solid fa-floppy-disk"></i> GUARDAR 
ESTADO</button>
  admin.html:870:                    </div>
  admin.html:871:                </div>
  admin.html:872:
  admin.html:873:                <!-- TOGGLE ROBOT LOCAL CRM -->
  admin.html:874:                <div style="background: rgba(46, 204, 113, 0.08); border: 2px solid #2ecc71; 
border-radius: 12px; padding: 1.2rem; margin-bottom: 2rem;">
  admin.html:875:                    <label style="color:#2ecc71; font-weight:bold; font-size: 1.1rem; display:block; 
margin-bottom:0.5rem;">
  admin.html:876:                        <i class="fa-solid fa-robot"></i> MODO ROBOT LOCAL (Enviar CRM a tu Número 
Primero)
  admin.html:877:                    </label>
  admin.html:878:                    <p style="font-size: 0.85rem; color: #ccc; margin-bottom: 1rem;">
  admin.html:879:                        <strong style="color:#2ecc71;">ACTIVO:</strong> El sistema te enviará el 
comando <code style="background:rgba(0,0,0,0.4); padding:2px 6px; border-radius:4px; 
font-size:0.8rem;">CMD_CRM@@@TEL:...@@@TX:...@@@IMG:...</code> a <strong>TU número</strong> para que tu Robot lo 
procese y reenvíe al cliente.<br>
  admin.html:880:                        <strong style="color:#e74c3c;">INACTIVO:</strong> El mensaje se abre 
directamente en WhatsApp Web hacia el número del cliente.
  admin.html:881:                    </p>
  admin.html:882:                    <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:883:                        <select id="conf-useLocalRobotCRM" style="flex:1; border:1px solid #2ecc71; 
background: #000; color: white; padding: 10px; border-radius: 8px;">
  admin.html:884:                            <option value="true">✅ SÍ - USAR ROBOT LOCAL (Llega a MI número 
primero)</option>
  admin.html:885:                            <option value="false">❌ NO - Envío directo al cliente por WhatsApp 
Web</option>
  admin.html:886:                        </select>
  admin.html:887:                        <button class="save-btn" onclick="saveConfig()"
  admin.html:888:                            style="margin:0; padding:10px 20px; width:auto; background:#2ecc71; 
color: black; font-weight: bold; border-radius: 8px;"
  admin.html:889:                            title="Guardar Robot"><i class="fa-solid fa-floppy-disk"></i> 
GUARDAR</button>
  admin.html:890:                    </div>
  admin.html:891:                    <div id="robot-status-indicator" style="margin-top:0.8rem; padding:8px 12px; 
border-radius:8px; font-size:0.8rem; font-weight:bold; background:rgba(0,0,0,0.3); display:none;">
  admin.html:892:                    </div>
  admin.html:893:                </div>
  admin.html:894:
  admin.html:895:                <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:896:                    <div class="form-col">
  admin.html:897:                        <label>Plantilla de Mensaje (Paso 1)</label>
  admin.html:898:                        <textarea id="conf-msgTemplate1" rows="3" style="flex:1;" placeholder="Ej: 
Hola {cliente}, su pantalla está lista."></textarea>
  admin.html:899:                    </div>
  admin.html:900:                    <div class="form-col">
  admin.html:901:                        <label>Plantilla de Mensaje (Paso 2)</label>
  admin.html:902:                        <textarea id="conf-msgTemplate2" rows="3" style="flex:1;" placeholder="Ej: 
Gracias por su compra."></textarea>
  admin.html:903:                    </div>
  admin.html:904:                </div>
  admin.html:905:                <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:906:                    <div class="form-col" style="grid-column: span 2;">
  admin.html:907:                        <label>Fotos / Textos para CRM</label>
  admin.html:908:                        <div id="crm-platforms-container"></div>
  admin.html:909:                        <button class="save-btn" onclick="addCRMPlatform()" 
style="background:var(--accent-primary); width:auto;">
  admin.html:910:                            <i class="fa-solid fa-plus"></i> Añadir Plataforma CRM
  admin.html:911:                        </button>
  admin.html:912:                    </div>
  admin.html:913:                </div>
  admin.html:914:                <button class="save-btn" onclick="saveConfig()" style="margin-top:1rem; 
background:#9b59b6; height:50px; font-size:1.1rem; font-weight:bold;"><i class="fa-solid fa-floppy-disk"></i> Guardar 
Todo el CRM</button>
  admin.html:915:            </div>
  admin.html:916:        </div>
  admin.html:917:
  admin.html:918:        <!-- TAB POLLA -->
  admin.html:919:        <div id="tab-polla" class="tab-content">
  admin.html:920:            <div class="admin-form" style="padding: 0; min-height: 80vh;">
  admin.html:921:                <iframe src="polla/admin_polla.html?v=1.1" style="width: 100%; height: 85vh; border: 
none; border-radius: 20px;"></iframe>
  admin.html:922:            </div>
  admin.html:923:        </div>
  admin.html:924:
  admin.html:925:        <!-- TAB CONFIGURACIÓN -->
  admin.html:926:        <div id="tab-configuracion" class="tab-content">
  admin.html:927:            <div class="admin-form" style="padding-bottom: 2rem;">
  admin.html:928:                <h2 style="margin-bottom: 1.5rem;"><i class="fa-solid fa-gear" 
style="color:var(--accent-primary);"></i>
  admin.html:929:                    Panel
  admin.html:930:                    de Configuración</h2>
  admin.html:931:
  admin.html:932:                <!-- Sub Tabs Bar -->
  admin.html:933:                <div
  admin.html:934:                    style="display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid 
var(--glass-border); padding-bottom: 1rem; overflow-x: auto;">
  admin.html:935:                    <button class="save-btn sub-conf-btn" id="btn-conf-general" 
onclick="showSubConf('general', this)"
  admin.html:936:                        style="margin:0; width:auto; border-radius:8px; padding: 10px 15px; 
background:white; color:black;">Generales</button>
  admin.html:937:                    <button class="save-btn sub-conf-btn" id="btn-conf-clientes" 
onclick="showSubConf('clientes', this)"
  admin.html:938:                        style="margin:0; width:auto; border-radius:8px; padding: 10px 15px; 
background:var(--glass); color:var(--text-secondary);">Clientes
  admin.html:939:                        (Solo Administrador)</button>
  admin.html:940:                    <button class="save-btn sub-conf-btn" id="btn-conf-ventas" 
onclick="showSubConf('ventas', this)"
  admin.html:941:                        style="margin:0; width:auto; border-radius:8px; padding: 10px 15px; 
background:var(--glass); color:var(--text-secondary);">Ventas
  admin.html:942:                        (Solo Vendedores)</button>
  admin.html:943:                    <button class="save-btn sub-conf-btn" id="btn-conf-total" 
onclick="showSubConf('total', this)"
  admin.html:944:                        style="margin:0; width:auto; border-radius:8px; padding: 10px 15px; 
background:var(--glass); color:var(--text-secondary);">Total
  admin.html:945:                        Ventas (Mes)</button>
  admin.html:946:                    <button class="save-btn sub-conf-btn" id="btn-conf-seguridad"
  admin.html:947:                        onclick="showSubConf('seguridad', this)"
  admin.html:948:                        style="margin:0; width:auto; border-radius:8px; padding: 10px 15px; 
background:var(--glass); color:var(--text-secondary);">Accesos
  admin.html:949:                        / Seguridad</button>
  admin.html:950:                    <button class="save-btn sub-conf-btn" id="btn-conf-mensajes"
  admin.html:951:                        onclick="switchTab('crm', document.querySelector('.admin-tab:nth-child(7)'))"
  admin.html:952:                        style="margin:0; width:auto; border-radius:8px; padding: 10px 15px; 
background:var(--glass); color:var(--text-secondary);">Mensajes / CRM</button>
  admin.html:953:                    <button class="save-btn sub-conf-btn" id="btn-conf-emails"
  admin.html:954:                        onclick="showSubConf('emails', this)"
  admin.html:955:                        style="margin:0; width:auto; border-radius:8px; padding: 10px 15px; 
background:var(--glass); color:var(--text-secondary);"><i class="fa-solid fa-envelope"></i> Cuentas Correo</button>
  admin.html:956:                </div>
  admin.html:957:
  admin.html:958:</div>
  admin.html:959:
  admin.html:960:                <!-- SUB TAB: MENSAJES ya no se usa aqui, se movio a TAB CRM independiente -->
  admin.html:961:                <div id="sub-conf-mensajes" class="sub-conf-content" style="display:none;">
  admin.html:962:                    <h3><i class="fa-solid fa-comment-dots"></i> Configuración Mensajes / CRM</h3>
  admin.html:963:                    <button class="save-btn" onclick="switchTab('crm', 
document.querySelector('.admin-tab:nth-child(7)'))">Ir a la nueva pestaña CRM</button>
  admin.html:964:                </div>
  admin.html:965:
  admin.html:966:                <!-- SUB TAB: CUENTAS DE CORREO -->
  admin.html:967:                <div id="sub-conf-emails" class="sub-conf-content" style="display:none;">
  admin.html:968:                    <div style="background: rgba(42, 183, 202, 0.1); border: 1px solid #2ab7ca; 
border-radius: 12px; padding: 1rem; margin-bottom: 2rem;">
  admin.html:969:                        <h3 style="color:#2ab7ca; margin-top:0;"><i class="fa-solid 
fa-circle-info"></i> Guía para Gmail</h3>
  admin.html:970:                        <p style="font-size:0.9rem; color:#ccc;">Para usar Gmail, debes generar una 
<strong>Contraseña de Aplicación</strong>:</p>
  admin.html:971:                        <ol style="font-size:0.85rem; color:#aaa; padding-left:1.5rem;">
  admin.html:972:                            <li>Activa la "Verificación en 2 pasos" en tu cuenta Google.</li>
  admin.html:973:                            <li>Busca "Contraseñas de aplicaciones" en tu perfil.</li>
  admin.html:974:                            <li>Genera una para "Correo" y copia el código de 16 letras.</li>
  admin.html:975:                            <li>Usa ese código de 16 letras como contraseña aquí abajo.</li>
  admin.html:976:                        </ol>
  admin.html:977:                    </div>
  admin.html:978:
  admin.html:979:                    <h3>Mis Cuentas de Correo para Lectura de PIN</h3>
  admin.html:980:                    <div class="admin-form">
  admin.html:981:                        <div class="form-grid">
  admin.html:982:                            <div class="form-col">
  admin.html:983:                                <label>Correo Electrónico (Gmail)</label>
  admin.html:984:                                <input type="email" id="new-email-addr" 
placeholder="ejemplo@gmail.com">
  admin.html:985:                            </div>
  admin.html:986:                            <div class="form-col">
  admin.html:987:                                <label>Contraseña de Aplicación (16 letras)</label>
  admin.html:988:                                <input type="text" id="new-email-pass" placeholder="xxxx xxxx xxxx 
xxxx">
  admin.html:989:                            </div>
  admin.html:990:                        </div>
  admin.html:991:                                                <button class="save-btn" onclick="addEmailAccount()" 
style="background:var(--accent-primary);">
  admin.html:992:                            <i class="fa-solid fa-plus"></i> Vincular Nueva Cuenta de Correo
  admin.html:993:                        </button>
  admin.html:994:
  admin.html:995:                        <div style="margin-top: 1.5rem; border-top: 1px dashed rgba(255,255,255,0.1); 
padding-top: 1.5rem;">
  admin.html:996:                            <h4 style="margin:0 0 0.5rem 0; color:#2ecc71; font-size: 0.95rem;"><i 
class="fa-solid fa-file-csv"></i> Carga Masiva (CSV)</h4>
  admin.html:997:                            <p style="font-size:0.75rem; color:#888; margin-bottom:1rem;">Formato: 
<code>correo,contraseña</code> (uno por fila)</p>
  admin.html:998:                            <div style="display:flex; gap:10px; align-items:center;">
  admin.html:999:                                <input type="file" id="csv-emails-file" accept=".csv" style="flex:1; 
font-size:0.85rem; padding: 5px;">
  admin.html:1000:                                <button class="save-btn" onclick="uploadEmailsCSV()" 
style="margin:0; width:auto; background:#2ecc71; padding: 8px 15px; font-size: 0.85rem;">
  admin.html:1001:                                    <i class="fa-solid fa-upload"></i> Subir CSV
  admin.html:1002:                                </button>
  admin.html:1003:                            </div>
  admin.html:1004:                        </div>
  admin.html:1005:                    </div>
  admin.html:1006:
  admin.html:1007:                    <div id="email-accounts-list" style="margin-top:2rem; display:flex; 
flex-direction:column; gap:10px;">
  admin.html:1008:                        <!-- Lista de correos -->
  admin.html:1009:                        <p style="color:#777; text-align:center;">Cargando cuentas vinculadas...</p>
  admin.html:1010:                    </div>
  admin.html:1011:                </div>
  admin.html:1012:
  admin.html:1013:                <!-- SUB TAB: GENERAL -->
  admin.html:1014:                <div id="sub-conf-general" class="sub-conf-content" style="display:block;">
  admin.html:1015:                    <div class="form-grid" style="margin-bottom: 2rem; border: 2px solid #4cd137; 
border-radius: 12px; padding: 1rem; background: rgba(76, 209, 55, 0.05);">
  admin.html:1016:                        <div class="form-col" style="grid-column: 1 / -1;">
  admin.html:1017:                            <label style="color:#4cd137; font-weight:bold; font-size: 1.1rem;"><i 
class="fa-solid fa-trophy"></i> AJUSTES DE LA POLLA DEPORTIVA</label>
  admin.html:1018:                            <p style="font-size: 0.85rem; color: #ccc; margin-bottom: 
0.5rem;">Gestiona el valor de venta y configuración básica de la Polla.</p>
  admin.html:1019:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1020:                                <div style="flex:1;">
  admin.html:1021:                                    <label style="font-size:0.75rem;">Módulo Muestra a 
Clientes</label>
  admin.html:1022:                                    <select id="polla-enabled-input" style="width:100%; padding: 
0.5rem; border-radius: 8px;">
  admin.html:1023:                                        <option value="true">Activo</option>
  admin.html:1024:                                        <option value="false">Desactivado</option>
  admin.html:1025:                                    </select>
  admin.html:1026:                                </div>
  admin.html:1027:                                <div style="flex:1;">
  admin.html:1028:                                    <label style="font-size:0.75rem;">Precio de Participación 
($)</label>
  admin.html:1029:                                    <input type="number" id="polla-price-input" style="width:100%;" 
placeholder="10000">
  admin.html:1030:                                </div>
  admin.html:1031:                                <button class="save-btn" onclick="updatePollaPrice()"
  admin.html:1032:                                    style="margin:0; padding:10px 20px; width:auto; 
background:#4cd137; color: black; font-weight: bold; border-radius: 8px;"
  admin.html:1033:                                    title="Guardar Precio"><i class="fa-solid fa-floppy-disk"></i> 
ACTUALIZAR VALOR</button>
  admin.html:1034:                            </div>
  admin.html:1035:                        </div>
  admin.html:1036:                    </div>
  admin.html:1037:
  admin.html:1038:                    <div id="polla-save-status" style="font-size: 0.8rem; text-align: right; 
margin-top: -1.5rem; margin-bottom: 1rem; color: #4cd137; display:none;">¡Ajustes actualizados!</div>
  admin.html:1039:
> admin.html:1040:                    <script>
  admin.html:1041:                        db.ref('storeConfig/pollaEnabled').on('value', snap => {
  admin.html:1042:                            const val = snap.val();
  admin.html:1043:                            if(val !== null) document.getElementById('polla-enabled-input').value = 
val === true ? 'true' : 'false';
  admin.html:1044:                        });
  admin.html:1045:
  admin.html:1046:                        async function updatePollaPrice() {
  admin.html:1047:                            const price = document.getElementById('polla-price-input').value;
  admin.html:1048:                            const enabled = document.getElementById('polla-enabled-input').value === 
'true';
  admin.html:1049:                            const status = document.getElementById('polla-save-status');
  admin.html:1050:                            try {
  admin.html:1051:                                if (storeConfig) {
  admin.html:1052:                                    storeConfig.pollaEnabled = enabled;
  admin.html:1053:                                }
  admin.html:1054:                                await db.ref('storeConfig').update({ pollaEnabled: enabled });
  admin.html:1055:                                await db.ref('polla/config/precio').set(parseInt(price));
  admin.html:1056:                                status.style.display = 'block';
  admin.html:1057:                                setTimeout(() => status.style.display = 'none', 3000);
  admin.html:1058:                            } catch (e) {
  admin.html:1059:                                alert('Error al actualizar ajustes de la polla');
  admin.html:1060:                            }
  admin.html:1061:                        }
  admin.html:1062:
  admin.html:1063:                    </script>
  admin.html:1064:
  admin.html:1065:                    <div class="form-grid" style="margin-bottom: 2rem; border: 2px solid #f39c12; 
border-radius: 12px; padding: 1rem; background: rgba(243, 156, 18, 0.05);">
  admin.html:1066:                        <div class="form-col" style="grid-column: 1 / -1;">
  admin.html:1067:                            <label style="color:#f39c12; font-weight:bold; font-size: 1.1rem;"><i 
class="fa-solid fa-trophy"></i> ACTIVAR SISTEMA DE BONOS (VENDEDORES)</label>
  admin.html:1068:                            <p style="font-size: 0.85rem; color: #ccc; margin-bottom: 
0.5rem;">Habilita el cálculo automático de comisiones para tus vendedores según el producto vendido.</p>
  admin.html:1069:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1070:                                <select id="conf-incentiveEnabled" style="flex:1; border:1px solid 
#f39c12; background: #000; color: white; padding: 10px; border-radius: 8px;">
  admin.html:1071:                                    <option value="true">SÍ - ACTIVAR BONOS</option>
  admin.html:1072:                                    <option value="false">NO - DESACTIVAR BONOS</option>
  admin.html:1073:                                </select>
  admin.html:1074:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1075:                                    style="margin:0; padding:10px 20px; width:auto; 
background:#f39c12; color: black; font-weight: bold; border-radius: 8px;"
  admin.html:1076:                                    title="Guardar Cambios"><i class="fa-solid fa-floppy-disk"></i> 
GUARDAR CONFIGURACIÓN</button>
  admin.html:1077:                            </div>
  admin.html:1078:                        </div>
  admin.html:1079:                    </div>
  admin.html:1080:
  admin.html:1081:                    <h3>Ajustes Generales de la Tienda</h3>
  admin.html:1082:
  admin.html:1083:                    <div class="form-grid"
  admin.html:1084:                        style="margin-bottom: 1rem; border-bottom: 1px solid var(--glass-border); 
padding-bottom:1rem;">
  admin.html:1085:                        <div class="form-col">
  admin.html:1086:                            <label>Modo Mantenimiento (Apagar tienda visible)</label>
  admin.html:1087:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1088:                                <select id="conf-maintenanceEnabled" style="flex:1;">
  admin.html:1089:                                    <option value="false">Inactivo / En Línea</option>
  admin.html:1090:                                    <option value="true">Activo / En Mantenimiento</option>
  admin.html:1091:                                </select>
  admin.html:1092:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1093:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1094:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1095:                            </div>
  admin.html:1096:                        </div>
  admin.html:1097:                        <div class="form-col" style="grid-column: 1 / -1;">
  admin.html:1098:                            <label>Mensaje de Mantenimiento</label>
  admin.html:1099:                            <div style="display:flex; gap:0.5rem; align-items:flex-start;">
  admin.html:1100:                                <textarea id="conf-maintenanceMessage" rows="2" style="flex:1;"
  admin.html:1101:                                    placeholder="Ej: Estamos actualizando nuestros servicios, 
volvemos pronto."></textarea>
  admin.html:1102:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1103:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1104:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1105:                            </div>
  admin.html:1106:                        </div>
  admin.html:1107:                    </div>
  admin.html:1108:
  admin.html:1109:                    <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:1110:                        <label>Número de WhatsApp (Ej: 573155182545)</label>
  admin.html:1111:                        <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1112:                            <input type="text" id="conf-whatsapp" style="flex:1;">
  admin.html:1113:                            <button class="save-btn" onclick="saveConfig()"
  admin.html:1114:                                style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1115:                                title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1116:                        </div>
  admin.html:1117:                    </div>
  admin.html:1118:
  admin.html:1119:                    <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:1120:                        <div class="form-col">
  admin.html:1121:                            <label>Link de Facebook (Opcional)</label>
  admin.html:1122:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1123:                                <input type="text" id="conf-facebook" placeholder="Ej: 
https://facebook.com/pagina"
  admin.html:1124:                                    style="flex:1;">
  admin.html:1125:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1126:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1127:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1128:                            </div>
  admin.html:1129:                        </div>
  admin.html:1130:                        <div class="form-col">
  admin.html:1131:                            <label>Link de Instagram (Opcional)</label>
  admin.html:1132:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1133:                                <input type="text" id="conf-instagram" placeholder="Ej: 
https://instagram.com/pagina"
  admin.html:1134:                                    style="flex:1;">
  admin.html:1135:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1136:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1137:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1138:                            </div>
  admin.html:1139:                        </div>
  admin.html:1140:                    </div>
  admin.html:1141:
  admin.html:1142:                    <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:1143:                        <div class="form-col">
  admin.html:1144:                            <label>Link de TikTok (Opcional)</label>
  admin.html:1145:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1146:                                <input type="text" id="conf-tiktok" placeholder="Ej: 
https://tiktok.com/@tu_perfil"
  admin.html:1147:                                    style="flex:1;">
  admin.html:1148:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1149:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1150:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1151:                            </div>
  admin.html:1152:                        </div>
  admin.html:1153:                        <div class="form-col">
  admin.html:1154:                            <label>Link de Kwai (Opcional)</label>
  admin.html:1155:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1156:                                <input type="text" id="conf-kwai" placeholder="Ej: 
https://kwai.com/@tu_perfil"
  admin.html:1157:                                    style="flex:1;">
  admin.html:1158:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1159:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1160:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1161:                            </div>
  admin.html:1162:                        </div>
  admin.html:1163:                    </div>
  admin.html:1164:
  admin.html:1165:                    <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:1166:                        <div class="form-col">
  admin.html:1167:                            <label>Link de YouTube (Opcional)</label>
  admin.html:1168:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1169:                                <input type="text" id="conf-youtube" placeholder="Ej: 
https://youtube.com/@tu_canal"
  admin.html:1170:                                    style="flex:1;">
  admin.html:1171:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1172:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1173:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1174:                            </div>
  admin.html:1175:                        </div>
  admin.html:1176:                        <div class="form-col"></div>
  admin.html:1177:                    </div>
  admin.html:1178:
  admin.html:1179:                    <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:1180:                        <label>Información de Pagos (Mensaje de WhatsApp)</label>
  admin.html:1181:                        <div style="display:flex; gap:0.5rem; align-items:flex-start;">
  admin.html:1182:                            <textarea id="conf-paymentInfo" style="flex:1;"></textarea>
  admin.html:1183:                            <button class="save-btn" onclick="saveConfig()"
  admin.html:1184:                                style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1185:                                title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1186:                        </div>
  admin.html:1187:                    </div>
  admin.html:1188:
  admin.html:1189:                    <div class="form-grid"
  admin.html:1190:                        style="margin-bottom: 1rem; border-top: 1px solid var(--glass-border); 
padding-top:1rem;">
  admin.html:1191:                        <div class="form-col" style="grid-column: 1 / -1;">
  admin.html:1192:                            <h3 style="margin-bottom: 0.5rem; color: #f39c12;"><i class="fa-solid 
fa-list"
  admin.html:1193:                                    style="color:#f39c12;"></i> Orden de Pestañas</h3>
  admin.html:1194:                            <p style="font-size:0.85rem; color:#a0a0a0; margin-bottom:1rem;">Define 
el orden en el que
  admin.html:1195:                                quieres
  admin.html:1196:                                que aparezcan las pestañas. Separa cada una por comas. (Valores:
  admin.html:1197:                                
individual,ventas_extras,combos2,combos3,combos4,combos5,promociones_finde,promociones,all)
  admin.html:1198:                            </p>
  admin.html:1199:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1200:                                <input type="text" id="conf-tabOrder" style="flex:1;"
  admin.html:1201:                                    placeholder="Ej: 
individual,ventas_extras,combos2,combos3,combos4,combos5,promociones_finde,promociones,all">
  admin.html:1202:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1203:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1204:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1205:                            </div>
  admin.html:1206:                        </div>
  admin.html:1207:                    </div>
  admin.html:1208:                </div>
  admin.html:1209:
  admin.html:1210:                <!-- SUB TAB: CLIENTES -->
  admin.html:1211:                <div id="sub-conf-clientes" class="sub-conf-content" style="display:none;">
  admin.html:1212:                    <h3>Configuración Exclusiva para Clientes</h3>
  admin.html:1213:
  admin.html:1214:                    <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:1215:                        <div class="form-col">
  admin.html:1216:                            <label>Descuento CLIENTES FINALES (Múltiples pantallas)</label>
  admin.html:1217:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1218:                                <select id="conf-discountEnabled" style="flex:1;">
  admin.html:1219:                                    <option value="true">Activo / Habilitado</option>
  admin.html:1220:                                    <option value="false">Inactivo / Apagado</option>
  admin.html:1221:                                </select>
  admin.html:1222:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1223:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1224:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1225:                            </div>
  admin.html:1226:                        </div>
  admin.html:1227:                        <div class="form-col">
  admin.html:1228:                            <label>Valor a descontar ($) Clientes</label>
  admin.html:1229:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1230:                                <input type="number" id="conf-discountAmount" style="flex:1;">
  admin.html:1231:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1232:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1233:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1234:                            </div>
  admin.html:1235:                        </div>
  admin.html:1236:                    </div>
  admin.html:1237:
  admin.html:1238:                    <div class="form-grid"
  admin.html:1239:                        style="margin-bottom: 1rem; border-top: 1px solid var(--glass-border); 
padding-top:1rem;">
  admin.html:1240:                        <div class="form-col">
  admin.html:1241:                            <label>Anuncio Flotante para CLIENTES</label>
  admin.html:1242:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1243:                                <select id="conf-clientBannerEnabled" style="flex:1;">
  admin.html:1244:                                    <option value="true">Activo / Visible</option>
  admin.html:1245:                                    <option value="false">Inactivo / Oculto</option>
  admin.html:1246:                                </select>
  admin.html:1247:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1248:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1249:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1250:                            </div>
  admin.html:1251:                        </div>
  admin.html:1252:                        <div class="form-col" style="grid-column: 1 / -1;">
  admin.html:1253:                            <label>Texto Anuncio Clientes</label>
  admin.html:1254:                            <div style="display:flex; gap:0.5rem; align-items:flex-start;">
  admin.html:1255:                                <textarea id="conf-clientBannerText" rows="2" style="flex:1;"
  admin.html:1256:                                    placeholder="Ej: ¡Lleva 2 pantallas y ahorra $1000!"></textarea>
  admin.html:1257:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1258:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1259:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1260:                            </div>
  admin.html:1261:                        </div>
  admin.html:1262:                    </div>
  admin.html:1263:
  admin.html:1264:                    <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:1265:                        <div class="form-col">
  admin.html:1266:                            <label>Valor descuento PROMOCIÓN Clientes ($)</label>
  admin.html:1267:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1268:                                <input type="number" id="conf-clientPromoDiscount" placeholder="Ej: 
1000"
  admin.html:1269:                                    style="flex:1;">
  admin.html:1270:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1271:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1272:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1273:                            </div>
  admin.html:1274:                        </div>
  admin.html:1275:                        <div class="form-col">
  admin.html:1276:                            <label>Límite de pantallas (P/Cliente)</label>
  admin.html:1277:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1278:                                <input type="number" id="conf-clientPromoLimit" placeholder="Ej: 2" 
style="flex:1;">
  admin.html:1279:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1280:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1281:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1282:                            </div>
  admin.html:1283:                            <span style="font-size:0.75rem; color:#ccc;">Las que excedan este límite 
se cobrarán a
  admin.html:1284:                                precio normal
  admin.html:1285:                                sin descuento.</span>
  admin.html:1286:                        </div>
  admin.html:1287:                    </div>
  admin.html:1288:
  admin.html:1289:                    <div class="form-grid"
  admin.html:1290:                        style="margin-bottom: 1rem; padding-top: 1rem; border-top: 1px solid 
var(--glass-border);">
  admin.html:1291:                        <div class="form-col">
  admin.html:1292:                            <label>Botón Obtener Código Netflix</label>
  admin.html:1293:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1294:                                <select id="conf-netflixEnabled" style="flex:1;">
  admin.html:1295:                                    <option value="true">Mostrar Visible</option>
  admin.html:1296:                                    <option value="false">Ocultar</option>
  admin.html:1297:                                </select>
  admin.html:1298:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1299:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1300:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1301:                            </div>
  admin.html:1302:                        </div>
  admin.html:1303:                        <div class="form-col">
  admin.html:1304:                            <label>Botón Obtener Código Disney</label>
  admin.html:1305:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1306:                                <select id="conf-disneyEnabled" style="flex:1;">
  admin.html:1307:                                    <option value="true">Mostrar Visible</option>
  admin.html:1308:                                    <option value="false">Ocultar</option>
  admin.html:1309:                                </select>
  admin.html:1310:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1311:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1312:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1313:                            </div>
  admin.html:1314:                        </div>
  admin.html:1315:                    </div>
  admin.html:1316:
  admin.html:1317:                    <div class="form-col"
  admin.html:1318:                        style="margin-bottom: 2rem; border-top: 1px solid var(--glass-border); 
padding-top:1rem;">
  admin.html:1319:                        <label>Mensaje Recordatorio Renovación (Usa {cliente} y {pantallas} para 
autocompletar)</label>
  admin.html:1320:                        <div style="display:flex; gap:0.5rem; align-items:flex-start;">
  admin.html:1321:                            <textarea id="conf-reminderTemplate"
  admin.html:1322:                                style="height: 150px; padding: 10px; flex:1;"></textarea>
  admin.html:1323:                            <button class="save-btn" onclick="saveConfig()"
  admin.html:1324:                                style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1325:                                title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1326:                        </div>
  admin.html:1327:                        <p style="font-size: 0.8rem; color: #a0a0a0; margin-top: 0.3rem;">Este 
mensaje se mandará por
  admin.html:1328:                            WhatsApp
  admin.html:1329:                            para los que vencen HOY.</p>
  admin.html:1330:                    </div>
  admin.html:1331:
  admin.html:1332:                    <div class="form-col" style="margin-bottom: 2rem; border-top: 1px solid 
var(--glass-border); padding-top:1rem;">
  admin.html:1333:                        <label>Mensaje Nueva Política Cap Month (Usa {cliente} para 
autocompletar)</label>
  admin.html:1334:                        <div style="display:flex; gap:0.5rem; align-items:flex-start;">
  admin.html:1335:                            <textarea id="conf-capMonthPolicyTemplate" style="height: 150px; 
padding: 10px; flex:1;"></textarea>
  admin.html:1336:                            <button class="save-btn" onclick="saveConfig()" style="margin:0; 
padding:10px 15px; width:auto; background:var(--accent-primary);" title="Guardar"><i class="fa-solid 
fa-floppy-disk"></i></button>
  admin.html:1337:                        </div>
  admin.html:1338:                        <p style="font-size: 0.8rem; color: #a0a0a0; margin-top: 0.3rem;">Este 
mensaje se usará cuando presiones "ENVIAR NUEVA POLÍTICA".</p>
  admin.html:1339:                    </div>
  admin.html:1340:
  admin.html:1341:
  admin.html:1342:                    <div class="form-col" style="margin-bottom: 2rem;">
  admin.html:1343:                        <label>Mensaje Vencimiento MAÑANA (Aviso Previo)</label>
  admin.html:1344:                        <div style="display:flex; gap:0.5rem; align-items:flex-start;">
  admin.html:1345:                            <textarea id="conf-reminderTomorrowTemplate"
  admin.html:1346:                                style="height: 100px; padding: 10px; flex:1;"></textarea>
  admin.html:1347:                            <button class="save-btn" onclick="saveConfig()"
  admin.html:1348:                                style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1349:                                title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1350:                        </div>
  admin.html:1351:                        <p style="font-size: 0.8rem; color: #a0a0a0; margin-top: 0.3rem;">Mensaje 
suave que se manda 1
  admin.html:1352:                            día
  admin.html:1353:                            antes.</p>
  admin.html:1354:                    </div>
  admin.html:1355:
  admin.html:1356:                    <div class="form-col" style="margin-bottom: 2rem; border-top: 1px solid 
var(--glass-border); padding-top: 1rem;">
  admin.html:1357:                        <label>Mensaje para VENDEDORES (Vencimiento HOY / YA VENCIÓ)</label>
  admin.html:1358:                        <div style="display:flex; gap:0.5rem; align-items:flex-start;">
  admin.html:1359:                            <textarea id="conf-sellerReminderTemplate"
  admin.html:1360:                                style="height: 120px; padding: 10px; flex:1;"></textarea>
  admin.html:1361:                            <button class="save-btn" onclick="saveConfig()"
  admin.html:1362:                                style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1363:                                title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1364:                        </div>
  admin.html:1365:                        <p style="font-size: 0.8rem; color: #a0a0a0; margin-top: 0.3rem;">Usa 
{vendedor}, {cliente}, {pantallas}, {celular}, {pin}, {total} y {pago} para autocompletar.</p>
  admin.html:1366:                    </div>
  admin.html:1367:
  admin.html:1368:                    <div class="form-col" style="margin-bottom: 2rem;">
  admin.html:1369:                        <label>Mensaje para VENDEDORES (Aviso MAÑANA)</label>
  admin.html:1370:                        <div style="display:flex; gap:0.5rem; align-items:flex-start;">
  admin.html:1371:                            <textarea id="conf-sellerReminderTomorrowTemplate"
  admin.html:1372:                                style="height: 100px; padding: 10px; flex:1;"></textarea>
  admin.html:1373:                            <button class="save-btn" onclick="saveConfig()"
  admin.html:1374:                                style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1375:                                title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1376:                        </div>
  admin.html:1377:                    </div>
  admin.html:1378:
  admin.html:1379:                    <div class="form-col" style="margin-bottom: 2rem; border-top: 1px solid 
var(--glass-border); padding-top: 1rem;">
  admin.html:1380:                        <label>Mensaje RENEWADA (Singular) - {cliente}, {pantallas} y {mes} para 
autocompletar</label>
  admin.html:1381:                        <div style="display:flex; gap:0.5rem; align-items:flex-start;">
  admin.html:1382:                            <textarea id="conf-renovadaSingularTemplate"
  admin.html:1383:                                style="height: 100px; padding: 10px; flex:1;"></textarea>
  admin.html:1384:                            <button class="save-btn" onclick="saveConfig()"
  admin.html:1385:                                style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1386:                                title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1387:                        </div>
  admin.html:1388:                    </div>
  admin.html:1389:
  admin.html:1390:                    <div class="form-col" style="margin-bottom: 2rem;">
  admin.html:1391:                        <label>Mensaje RENOVADA (Plural) - {cliente}, {pantallas} y {mes} para 
autocompletar</label>
  admin.html:1392:                        <div style="display:flex; gap:0.5rem; align-items:flex-start;">
  admin.html:1393:                            <textarea id="conf-renovadaPluralTemplate"
  admin.html:1394:                                style="height: 100px; padding: 10px; flex:1;"></textarea>
  admin.html:1395:                            <button class="save-btn" onclick="saveConfig()"
  admin.html:1396:                                style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1397:                                title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1398:                        </div>
  admin.html:1399:                    </div>
  admin.html:1400:
  admin.html:1401:                    <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:1402:                        <div class="form-col">
  admin.html:1403:                            <label>Asistente Automático Vencimiento HOY</label>
  admin.html:1404:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1405:                                <select id="conf-autoReminderEnabled" style="flex:1;">
  admin.html:1406:                                    <option value="true">Activo / Encendido</option>
  admin.html:1407:                                    <option value="false">Apagado</option>
  admin.html:1408:                                </select>
  admin.html:1409:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1410:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1411:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1412:                            </div>
  admin.html:1413:                            <p style="font-size: 0.75rem; color: #a0a0a0; margin-top: 5px;">Abre las 
ventanas de
  admin.html:1414:                                WhatsApp de los
  admin.html:1415:                                que vencen hoy.</p>
  admin.html:1416:                        </div>
  admin.html:1417:                        <div class="form-col">
  admin.html:1418:                            <label>Asistente Automático Aviso MAÑANA</label>
  admin.html:1419:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1420:                                <select id="conf-autoReminderTomorrowEnabled" style="flex:1;">
  admin.html:1421:                                    <option value="true">Activo / Encendido</option>
  admin.html:1422:                                    <option value="false">Apagado</option>
  admin.html:1423:                                </select>
  admin.html:1424:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1425:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1426:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1427:                            </div>
  admin.html:1428:                            <p style="font-size: 0.75rem; color: #a0a0a0; margin-top: 5px;">Abre las 
ventanas de
  admin.html:1429:                                WhatsApp para
  admin.html:1430:                                los que vencen mañana.</p>
  admin.html:1431:                        </div>
  admin.html:1432:                    </div>
  admin.html:1433:
  admin.html:1434:                    <div class="form-col" style="margin-bottom: 1rem;">
  admin.html:1435:                        <label>Hora de Activación (Formato 24h: 0 a 23)</label>
  admin.html:1436:                        <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1437:                            <input type="number" id="conf-autoReminderHour" min="0" max="23"
  admin.html:1438:                                placeholder="Ej: 8 para 8:00 AM" style="margin-bottom: 5px; flex:1;">
  admin.html:1439:                            <button class="save-btn" onclick="saveConfig()"
  admin.html:1440:                                style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1441:                                title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1442:                        </div>
  admin.html:1443:                        <button class="save-btn" onclick="checkDailyAutoReminders(true)"
  admin.html:1444:                            style="background:#f39c12; margin-top:5px; width:auto; padding: 8px 
15px; font-size:0.8rem;"><i
  admin.html:1445:                                class="fa-solid fa-play"></i> Forzar Envíos de Hoy AHORA</button>
  admin.html:1446:                    </div>
  admin.html:1447:                </div>
  admin.html:1448:
  admin.html:1449:                <!-- SUB TAB: VENTAS / VENDEDORES -->
  admin.html:1450:                <div id="sub-conf-ventas" class="sub-conf-content" style="display:none;">
  admin.html:1451:                    <h3>Configuración Exclusiva Vendedores</h3>
  admin.html:1452:
  admin.html:1453:                    <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:1454:                        <div class="form-col">
  admin.html:1455:                            <label>Descuento EXCLUSIVO VENDEDORES (Múltiples pantallas)</label>
  admin.html:1456:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1457:                                <select id="conf-sellerDiscountEnabled" style="flex:1;">
  admin.html:1458:                                    <option value="true">Activo / Habilitado</option>
  admin.html:1459:                                    <option value="false">Inactivo / Apagado</option>
  admin.html:1460:                                </select>
  admin.html:1461:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1462:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1463:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1464:                            </div>
  admin.html:1465:                        </div>
  admin.html:1466:                        <div class="form-col">
  admin.html:1467:                            <label>Valor a descontar ($) Vendedores</label>
  admin.html:1468:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1469:                                <input type="number" id="conf-sellerDiscountAmount" style="flex:1;">
  admin.html:1470:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1471:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1472:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1473:                            </div>
  admin.html:1474:                        </div>
  admin.html:1475:                    </div>
  admin.html:1476:
  admin.html:1477:                    <div class="form-grid"
  admin.html:1478:                        style="margin-bottom: 1rem; border-top: 1px solid var(--glass-border); 
padding-top:1rem;">
  admin.html:1479:                        <div class="form-col">
  admin.html:1480:                            <label>Anuncio Flotante EXCLUSIVO VENDEDORES</label>
  admin.html:1481:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1482:                                <select id="conf-sellerBannerEnabled" style="flex:1;">
  admin.html:1483:                                    <option value="true">Activo / Visible</option>
  admin.html:1484:                                    <option value="false">Inactivo / Oculto</option>
  admin.html:1485:                                </select>
  admin.html:1486:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1487:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1488:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1489:                            </div>
  admin.html:1490:                        </div>
  admin.html:1491:                        <div class="form-col" style="grid-column: 1 / -1;">
  admin.html:1492:                            <label>Texto Anuncio Vendedores</label>
  admin.html:1493:                            <div style="display:flex; gap:0.5rem; align-items:flex-start;">
  admin.html:1494:                                <textarea id="conf-sellerBannerText" rows="2" style="flex:1;"
  admin.html:1495:                                    placeholder="Ej: ¡Aprovecha el descuento mayorista 
hoy!"></textarea>
  admin.html:1496:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1497:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1498:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1499:                            </div>
  admin.html:1500:                        </div>
  admin.html:1501:                    </div>
  admin.html:1502:
  admin.html:1503:                    <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:1504:                        <div class="form-col">
  admin.html:1505:                            <label>Valor descuento PROMOCIÓN Vendedores ($)</label>
  admin.html:1506:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1507:                                <input type="number" id="conf-sellerPromoDiscount" placeholder="Ej: 
2000"
  admin.html:1508:                                    style="flex:1;">
  admin.html:1509:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1510:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1511:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1512:                            </div>
  admin.html:1513:                        </div>
  admin.html:1514:                        <div class="form-col">
  admin.html:1515:                            <label>Límite de pantallas (P/Vendedor)</label>
  admin.html:1516:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1517:                                <input type="number" id="conf-sellerPromoLimit" placeholder="Ej: 5" 
style="flex:1;">
  admin.html:1518:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1519:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1520:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1521:                            </div>
  admin.html:1522:                            <span style="font-size:0.75rem; color:#ccc;">Al habilitar el anuncio, 
este descuento
  admin.html:1523:                                reemplazará al
  admin.html:1524:                                descuento múltiple común y corriente.</span>
  admin.html:1525:                        </div>
  admin.html:1526:                    </div>
  admin.html:1527:
  admin.html:1528:                    <h4 style="margin-top: 1rem; border-top: 1px solid var(--glass-border); 
padding-top: 1rem;">
  admin.html:1529:                        Incentivos Individuales Vendedores</h4>
  admin.html:1530:                    <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:1531:                        <div class="form-col">
  admin.html:1532:                            <label>Bono Netflix ($)</label>
  admin.html:1533:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1534:                                <input type="number" id="conf-incentiveNetflix" placeholder="Ej: 
500" style="flex:1;">
  admin.html:1535:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1536:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1537:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1538:                            </div>
  admin.html:1539:                        </div>
  admin.html:1540:                        <div class="form-col">
  admin.html:1541:                            <label>Bono Netflix Privada ($)</label>
  admin.html:1542:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1543:                                <input type="number" id="conf-incentiveNetflixPrivada" 
placeholder="Ej: 500" style="flex:1;">
  admin.html:1544:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1545:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1546:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1547:                            </div>
  admin.html:1548:                        </div>
  admin.html:1549:                        <div class="form-col">
  admin.html:1550:                            <label>Bono Disney+ ($)</label>
  admin.html:1551:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1552:                                <input type="number" id="conf-incentiveDisney" placeholder="Ej: 500" 
style="flex:1;">
  admin.html:1553:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1554:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1555:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1556:                            </div>
  admin.html:1557:                        </div>
  admin.html:1558:                        <div class="form-col">
  admin.html:1559:                            <label>Bono HBO Max ($)</label>
  admin.html:1560:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1561:                                <input type="number" id="conf-incentiveHbo" placeholder="Ej: 500" 
style="flex:1;">
  admin.html:1562:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1563:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1564:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1565:                            </div>
  admin.html:1566:                        </div>
  admin.html:1567:                        <div class="form-col">
  admin.html:1568:                            <label>Bono Prime Video ($)</label>
  admin.html:1569:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1570:                                <input type="number" id="conf-incentivePrime" placeholder="Ej: 500" 
style="flex:1;">
  admin.html:1571:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1572:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1573:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1574:                            </div>
  admin.html:1575:                        </div>
  admin.html:1576:                        <div class="form-col">
  admin.html:1577:                            <label>Bono Paramount+ ($)</label>
  admin.html:1578:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1579:                                <input type="number" id="conf-incentiveParamount" placeholder="Ej: 
500" style="flex:1;">
  admin.html:1580:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1581:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1582:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1583:                            </div>
  admin.html:1584:                        </div>
  admin.html:1585:                        <div class="form-col">
  admin.html:1586:                            <label>Bono Vix ($)</label>
  admin.html:1587:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1588:                                <input type="number" id="conf-incentiveVix" placeholder="Ej: 500" 
style="flex:1;">
  admin.html:1589:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1590:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1591:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1592:                            </div>
  admin.html:1593:                        </div>
  admin.html:1594:                        <div class="form-col">
  admin.html:1595:                            <label>Bono IPTV ($)</label>
  admin.html:1596:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1597:                                <input type="number" id="conf-incentiveIptv" placeholder="Ej: 500" 
style="flex:1;">
  admin.html:1598:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1599:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1600:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1601:                            </div>
  admin.html:1602:                        </div>
  admin.html:1603:                        <div class="form-col">
  admin.html:1604:                            <label>Bono Crunchyroll ($)</label>
  admin.html:1605:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1606:                                <input type="number" id="conf-incentiveCrunchyroll" placeholder="Ej: 
500"
  admin.html:1607:                                    style="flex:1;">
  admin.html:1608:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1609:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1610:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1611:                            </div>
  admin.html:1612:                        </div>
  admin.html:1613:                        <div class="form-col">
  admin.html:1614:                            <label>Bono Apple TV ($)</label>
  admin.html:1615:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1616:                                <input type="number" id="conf-incentiveApple" placeholder="Ej: 500" 
style="flex:1;">
  admin.html:1617:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1618:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1619:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1620:                            </div>
  admin.html:1621:                        </div>
  admin.html:1622:                    </div>
  admin.html:1623:                    <h4 style="margin-top: 1rem; border-top: 1px solid var(--glass-border); 
padding-top: 1rem;">
  admin.html:1624:                        Incentivos por
  admin.html:1625:                        Combos Vendedores</h4>
  admin.html:1626:                    <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:1627:                        <div class="form-col">
  admin.html:1628:                            <label>Bono x Combo 2 P. ($)</label>
  admin.html:1629:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1630:                                <input type="number" id="conf-incentiveCombo2" placeholder="Ej: 
2000" style="flex:1;">
  admin.html:1631:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1632:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1633:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1634:                            </div>
  admin.html:1635:                        </div>
  admin.html:1636:                        <div class="form-col">
  admin.html:1637:                            <label>Bono x Combo 3 P. ($)</label>
  admin.html:1638:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1639:                                <input type="number" id="conf-incentiveCombo3" placeholder="Ej: 
3000" style="flex:1;">
  admin.html:1640:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1641:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1642:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1643:                            </div>
  admin.html:1644:                        </div>
  admin.html:1645:                        <div class="form-col">
  admin.html:1646:                            <label>Bono x Combo 4 P. ($)</label>
  admin.html:1647:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1648:                                <input type="number" id="conf-incentiveCombo4" placeholder="Ej: 
4000" style="flex:1;">
  admin.html:1649:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1650:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1651:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1652:                            </div>
  admin.html:1653:                        </div>
  admin.html:1654:                        <div class="form-col">
  admin.html:1655:                            <label>Bono x Combo 5+ P. ($)</label>
  admin.html:1656:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1657:                                <input type="number" id="conf-incentiveCombo5" placeholder="Ej: 
5000" style="flex:1;">
  admin.html:1658:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1659:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1660:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1661:                            </div>
  admin.html:1662:                        </div>
  admin.html:1663:                    </div>
  admin.html:1664:                    <div class="form-grid" style="margin-bottom: 1rem;">
  admin.html:1665:                        <div class="form-col">
  admin.html:1666:                            <label>Bono x Promo Fin de Semana ($)</label>
  admin.html:1667:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1668:                                <input type="number" id="conf-incentiveFinde" placeholder="Ej: 6000" 
style="flex:1;">
  admin.html:1669:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1670:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1671:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1672:                            </div>
  admin.html:1673:                        </div>
  admin.html:1674:                        <div class="form-col">
  admin.html:1675:                            <label>Bono x Promo del Mes ($)</label>
  admin.html:1676:                            <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1677:                                <input type="number" id="conf-incentiveMes" placeholder="Ej: 8000" 
style="flex:1;">
  admin.html:1678:                                <button class="save-btn" onclick="saveConfig()"
  admin.html:1679:                                    style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1680:                                    title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1681:                            </div>
  admin.html:1682:                        </div>
  admin.html:1683:                    </div>
  admin.html:1684:                    <div style="margin-top: 1.5rem; border-top: 1px solid var(--glass-border); 
padding-top: 1.5rem;">
  admin.html:1685:                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; 
color:var(--accent-primary);">Mensaje de Bonos / Felicitación (WhatsApp)</label>
  admin.html:1686:                        <textarea id="conf-incentiveMessage" placeholder="Ej: ¡Felicidades 
{vendedor}! Has ganado un bono de {monto} por tu venta de {items}. ¡Sigue así! 🚀" 
  admin.html:1687:                            style="width:100%; height:100px; border-radius:10px; padding:15px; 
border:1px solid var(--glass-border); background:rgba(0,0,0,0.3); color:white; font-size:0.95rem; 
line-height:1.5;"></textarea>
  admin.html:1688:                        <button class="save-btn" onclick="saveConfig()" style="margin-top:0.8rem; 
width:100%; background:var(--accent-primary); height:45px; font-weight:bold; display:flex; align-items:center; 
justify-content:center; gap:10px;">
  admin.html:1689:                            <i class="fa-solid fa-floppy-disk"></i> Guardar Mensaje de Bonos
  admin.html:1690:                        </button>
  admin.html:1691:                        <p style="font-size:0.8rem; color:#aaa; margin-top:0.5rem; 
background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; border-left:3px solid var(--accent-primary);">
  admin.html:1692:                            <i class="fa-solid fa-circle-info"></i> Puedes usar <b>{vendedor}</b>, 
<b>{monto}</b> e <b>{items}</b> como variables en tu mensaje.
  admin.html:1693:                        </p>
  admin.html:1694:                    </div>
  admin.html:1695:                </div>
  admin.html:1696:
  admin.html:1697:                <!-- SUB TAB: TOTAL VENTAS -->
  admin.html:1698:                <div id="sub-conf-total" class="sub-conf-content" style="display:none;">
  admin.html:1699:                    <h3><i class="fa-solid fa-chart-pie"></i> Total Ventas Mensuales</h3>
  admin.html:1700:                    <p style="font-size:0.9rem; color:#a0a0a0; margin-bottom: 1.5rem;">Concentrado 
de las ventas
  admin.html:1701:                        aprobadas con
  admin.html:1702:                        sus totales separadas por mes.</p>
  admin.html:1703:
  admin.html:1704:                    <div id="monthly-sales-report"
  admin.html:1705:                        style="background: var(--glass); border-radius: 12px; padding: 1.5rem; 
border: 1px solid var(--glass-border);">
  admin.html:1706:                        <p style="color:#ccc; text-align:center;">Cargando concentrado de 
ventas...</p>
  admin.html:1707:                    </div>
  admin.html:1708:                    <button class="save-btn" onclick="loadMonthlySalesReport()" 
style="margin-top:1rem; width:100%;"><i
  admin.html:1709:                            class="fa-solid fa-rotate-right"></i> Actualizar Reporte</button>
  admin.html:1710:                </div>
  admin.html:1711:
  admin.html:1712:                <!-- SUB TAB: SEGURIDAD Y ACCESOS -->
  admin.html:1713:                <div id="sub-conf-seguridad" class="sub-conf-content" style="display:none;">
  admin.html:1714:                    <h3>Contraseñas de Sistema</h3>
  admin.html:1715:
  admin.html:1716:                    <div class="form-col"
  admin.html:1717:                        style="margin-bottom: 2rem; border-top: 1px solid var(--glass-border); 
padding-top:1rem;">
  admin.html:1718:                        <label>Contraseña Acceso Vendedores</label>
  admin.html:1719:                        <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1720:                            <input type="text" id="conf-sellerPassword" placeholder="Ej: 
misvendedores123"
  admin.html:1721:                                style="flex:1;">
  admin.html:1722:                            <button class="save-btn" onclick="saveConfig()"
  admin.html:1723:                                style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1724:                                title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1725:                        </div>
  admin.html:1726:                        <p style="font-size: 0.8rem; color: #a0a0a0; margin-top: 0.3rem;">Quien 
digite esta clave en la
  admin.html:1727:                            tienda
  admin.html:1728:                            verá los Precios de Vendedor.</p>
  admin.html:1729:                    </div>
  admin.html:1730:
  admin.html:1731:                    <div class="form-col" style="margin-bottom: 2rem;">
  admin.html:1732:                        <label>Contraseña de Acceso Administrador (Este Panel)</label>
  admin.html:1733:                        <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:1734:                            <input type="text" id="conf-adminPassword" placeholder="Ej: admin123" 
style="flex:1;">
  admin.html:1735:                            <button class="save-btn" onclick="saveConfig()"
  admin.html:1736:                                style="margin:0; padding:10px 15px; width:auto; 
background:var(--accent-primary);"
  admin.html:1737:                                title="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
  admin.html:1738:                        </div>
  admin.html:1739:                        <p style="font-size: 0.8rem; color: #a0a0a0; margin-top: 0.3rem;">Quien 
digite esta clave en el
  admin.html:1740:                            login de
  admin.html:1741:                            administradores podrá acceder y modificar toda la tienda.</p>
  admin.html:1742:                    </div>
  admin.html:1743:
  admin.html:1744:                    <div class="form-col"
  admin.html:1745:                        style="margin-bottom: 2rem; border-top: 1px solid var(--glass-border); 
padding-top:1rem;">
  admin.html:1746:                        <label>Respaldo de Sistema Completo</label>
  admin.html:1747:                        <p style="font-size: 0.8rem; color: #a0a0a0; margin-bottom: 
0.8rem;">Descarga una copia de
  admin.html:1748:                            seguridad o restaura un respaldo previo. Cuando descargues, guárdalo en 
tu carpeta
  admin.html:1749:                            <strong>F:\Resp Antigravity</strong>.
  admin.html:1750:                        </p>
  admin.html:1751:                        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
  admin.html:1752:                            <button class="save-btn" onclick="downloadBackup()"
  admin.html:1753:                                style="margin:0; flex:1; min-width:200px; background:#2980b9;"><i
  admin.html:1754:                                    class="fa-solid fa-download"></i> Realizar Respaldo</button>
  admin.html:1755:                            <button class="save-btn" onclick="triggerRestoreBackup()"
  admin.html:1756:                                style="margin:0; flex:1; min-width:200px; background:#8e44ad;"><i
  admin.html:1757:                                    class="fa-solid fa-upload"></i> Restaurar desde Respaldo</button>
  admin.html:1758:                            <input type="file" id="restore-backup-file" accept=".json" 
style="display:none;"
  admin.html:1759:                                onchange="handleRestoreBackup(event)">
  admin.html:1760:                        </div>
  admin.html:1761:                    </div>
  admin.html:1762:                </div>
  admin.html:1763:
  admin.html:1764:                <div style="margin-top: 2rem; border-top: 1px solid var(--glass-border); 
padding-top: 1rem;">
  admin.html:1765:                    <button class="save-btn" onclick="saveConfig()" style="width: 100%;"><i
  admin.html:1766:                            class="fa-solid fa-check"></i>
  admin.html:1767:                        Guardar Todos los Cambios Locales en la Nube</button>
  admin.html:1768:                </div>
  admin.html:1769:            </div>
  admin.html:1770:        </div>
  admin.html:1771:    </div>
  admin.html:1772:    </div>
  admin.html:1773:    </div>
  admin.html:1774:
  admin.html:1775:    <!-- MODAL PARA SELECCIONAR PANTALLA CRM -->
  admin.html:1776:    <div id="crm-selector-modal" style="display:none; position:fixed; top:0; left:0; width:100%; 
height:100%; background:rgba(0,0,0,0.85); z-index:9999; align-items:center; justify-content:center; padding:20px;">
  admin.html:1777:        <div style="background:var(--bg-secondary); border: 1px solid var(--glass-border); 
max-width:700px; width:100%; border-radius:16px; padding:2rem; position:relative; box-shadow:0 10px 30px 
rgba(0,0,0,0.5);">
  admin.html:1778:            <button onclick="closeCRMSelector()" style="position:absolute; top:1rem; right:1rem; 
background:transparent; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
  admin.html:1779:            <h2 style="color:var(--accent-primary); margin-bottom:1rem; display:flex; 
align-items:center; gap:0.8rem;">
  admin.html:1780:                <i class="fa-solid fa-comment-dots"></i> Enviar Respuestas (CRM)
  admin.html:1781:            </h2>
  admin.html:1782:            <p style="color:#ccc; font-size:0.9rem; margin-bottom:1rem;">Selecciona la plataforma 
que el cliente está comprando:</p>
  admin.html:1783:            
  admin.html:1784:            <!-- BUSCADOR DE PLATAFORMAS -->
  admin.html:1785:            <div style="margin-bottom:1.5rem; position:relative;">
  admin.html:1786:                <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:1rem; 
top:50%; transform:translateY(-50%); color:#777;"></i>
  admin.html:1787:                <input type="text" id="crm-platform-search" placeholder="Buscar plataforma (Netflix, 
Disney...)" 
  admin.html:1788:                    style="width:100%; padding:0.8rem 1rem 0.8rem 2.8rem; border-radius:10px; 
border:1px solid var(--glass-border); background:rgba(255,255,255,0.05); color:white; outline:none;"
  admin.html:1789:                    onkeyup="filterCRMPlatforms(this.value)">
  admin.html:1790:            </div>
  admin.html:1791:
  admin.html:1792:            <div id="crm-platforms-selection-list" style="display:grid; 
grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:1rem; max-height:400px; overflow-y:auto; 
padding-right:5px;">
  admin.html:1793:                <!-- Botones se generan aqui -->
  admin.html:1794:            </div>
  admin.html:1795:            
  admin.html:1796:            <div style="margin-top:2rem; display:flex; justify-content:center;">
  admin.html:1797:                <button onclick="closeCRMSelector()" class="save-btn" style="width:auto; 
padding:10px 40px; background:#444; border:1px solid #555;">
  admin.html:1798:                    <i class="fa-solid fa-check"></i> Finalizar Envíos
  admin.html:1799:                </button>
  admin.html:1800:            </div>
  admin.html:1801:        </div>
  admin.html:1802:    </div>
  admin.html:1803:
> admin.html:1804:    <script>
  admin.html:1805:        // Protcción de página
  admin.html:1806:        if (localStorage.getItem('adminLoggedIn') !== 'true') {
  admin.html:1807:            window.location.href = 'login.html';
  admin.html:1808:        }
  admin.html:1809:
  admin.html:1810:        function showSubConf(subTabId, btn) {
  admin.html:1811:            document.querySelectorAll('.sub-conf-content').forEach(el => el.style.display = 'none');
  admin.html:1812:            document.getElementById('sub-conf-' + subTabId).style.display = 'block';
  admin.html:1813:
  admin.html:1814:            document.querySelectorAll('.sub-conf-btn').forEach(b => {
  admin.html:1815:                b.style.background = 'var(--glass)';
  admin.html:1816:                b.style.color = 'var(--text-secondary)';
  admin.html:1817:            });
  admin.html:1818:            btn.style.background = 'white';
  admin.html:1819:            btn.style.color = 'black';
  admin.html:1820:
  admin.html:1821:            if (subTabId === 'total') {
  admin.html:1822:                loadMonthlySalesReport();
  admin.html:1823:            }
  admin.html:1824:            if (subTabId === 'emails') {
  admin.html:1825:                fetchEmailAccounts();
  admin.html:1826:            }
  admin.html:1827:        }
  admin.html:1828:
  admin.html:1829:        window.fetchEmailAccounts = function() {
  admin.html:1830:            const list = document.getElementById('email-accounts-list');
  admin.html:1831:            if(!list) return;
  admin.html:1832:
  admin.html:1833:            db.ref('emailAccounts').on('value', snap => {
  admin.html:1834:                const accounts = snap.val() || {};
  admin.html:1835:                list.innerHTML = '';
  admin.html:1836:                
  admin.html:1837:                const keys = Object.keys(accounts);
  admin.html:1838:                if (keys.length === 0) {
  admin.html:1839:                    list.innerHTML = '<p style="color:#777; text-align:center;">No hay cuentas de 
correo vinculadas aún.</p>';
  admin.html:1840:                    return;
  admin.html:1841:                }
  admin.html:1842:
  admin.html:1843:                keys.forEach(key => {
  admin.html:1844:                    const acc = accounts[key];
  admin.html:1845:                    const pass = acc.password || "";
  admin.html:1846:                    const last4 = pass.length > 4 ? pass.substring(pass.length - 4) : pass;
  admin.html:1847:                    const masked = "*".repeat(Math.max(0, pass.length - 4)) + last4;
  admin.html:1848:
  admin.html:1849:                    const div = document.createElement('div');
  admin.html:1850:                    div.className = 'admin-item';
  admin.html:1851:                    div.innerHTML = `
  admin.html:1852:                        <div style="color:var(--accent-primary); font-size:1.5rem;"><i 
class="fa-solid fa-envelope"></i></div>
  admin.html:1853:                        <div style="flex:1;">
  admin.html:1854:                            <strong style="color:white; font-size:1rem;">${acc.email}</strong><br>
  admin.html:1855:                            <span style="font-size:0.8rem; color:#888;">Contraseña: <span 
style="color:#2ab7ca; font-weight:bold;">${masked}</span></span>
  admin.html:1856:                        </div>
  admin.html:1857:                        <div class="item-actions">
  admin.html:1858:                            <button class="btn-icon btn-edit" onclick="editEmailAccount('${key}')" 
title="Editar"><i class="fa-solid fa-pen"></i></button>
  admin.html:1859:                            <button class="btn-icon btn-delete" 
onclick="deleteEmailAccount('${key}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
  admin.html:1860:                        </div>
  admin.html:1861:                    `;
  admin.html:1862:                    list.appendChild(div);
  admin.html:1863:                });
  admin.html:1864:            });
  admin.html:1865:        }
  admin.html:1866:
  admin.html:1867:        window.addEmailAccount = function() {
  admin.html:1868:            const email = document.getElementById('new-email-addr').value.trim();
  admin.html:1869:            const pass = document.getElementById('new-email-pass').value.trim();
  admin.html:1870:
  admin.html:1871:            if (!email || !pass) return alert('Debes completar el correo y la contraseña.');
  admin.html:1872:            if (!email.includes('@')) return alert('Ingresa un correo válido.');
  admin.html:1873:
  admin.html:1874:            db.ref('emailAccounts').push({
  admin.html:1875:                email: email,
  admin.html:1876:                password: pass,
  admin.html:1877:                provider: email.includes('gmail') ? 'gmail' : 'other',
  admin.html:1878:                createdAt: Date.now()
  admin.html:1879:            }).then(() => {
  admin.html:1880:                document.getElementById('new-email-addr').value = '';
  admin.html:1881:                document.getElementById('new-email-pass').value = '';
  admin.html:1882:                alert('Cuenta vinculada correctamente.');
  admin.html:1883:            });
  admin.html:1884:        }
  admin.html:1885:
  admin.html:1886:        window.uploadEmailsCSV = function() {
  admin.html:1887:            const fileInput = document.getElementById('csv-emails-file');
  admin.html:1888:            if (!fileInput.files || fileInput.files.length === 0) return alert('Selecciona un 
archivo CSV.');
  admin.html:1889:
  admin.html:1890:            const file = fileInput.files[0];
  admin.html:1891:            const reader = new FileReader();
  admin.html:1892:
  admin.html:1893:            reader.onload = function(e) {
  admin.html:1894:                const text = e.target.result;
  admin.html:1895:                const rows = text.split(/\r?\n/);
  admin.html:1896:                let added = 0;
  admin.html:1897:                let promises = [];
  admin.html:1898:
  admin.html:1899:                rows.forEach(row => {
  admin.html:1900:                    const columns = row.split(',');
  admin.html:1901:                    if (columns.length >= 2) {
  admin.html:1902:                        const email = columns[0].trim();
  admin.html:1903:                        const pass = columns[1].trim();
  admin.html:1904:
  admin.html:1905:                        if (email && pass && email.includes('@')) {
  admin.html:1906:                            const p = db.ref('emailAccounts').push({
  admin.html:1907:                                email: email,
  admin.html:1908:                                password: pass,
  admin.html:1909:                                provider: email.includes('gmail') ? 'gmail' : 'other',
  admin.html:1910:                                createdAt: Date.now()
  admin.html:1911:                            });
  admin.html:1912:                            promises.push(p);
  admin.html:1913:                            added++;
  admin.html:1914:                        }
  admin.html:1915:                    }
  admin.html:1916:                });
  admin.html:1917:
  admin.html:1918:                if (promises.length > 0) {
  admin.html:1919:                    Promise.all(promises).then(() => {
  admin.html:1920:                        alert(added + ' cuentas cargadas con éxito.');
  admin.html:1921:                        fileInput.value = '';
  admin.html:1922:                    }).catch(err => {
  admin.html:1923:                        console.error(err);
  admin.html:1924:                        alert('Error al subir algunas cuentas.');
  admin.html:1925:                    });
  admin.html:1926:                } else {
  admin.html:1927:                    alert('No se encontraron cuentas válidas en el archivo (Formato: 
correo,contraseña).');
  admin.html:1928:                }
  admin.html:1929:            };
  admin.html:1930:            reader.readAsText(file);
  admin.html:1931:        }
  admin.html:1932:
  admin.html:1933:        window.editEmailAccount = async function(key) {
  admin.html:1934:            const snap = await db.ref('emailAccounts/' + key).once('value');
  admin.html:1935:            const current = snap.val();
  admin.html:1936:            if(!current) return;
  admin.html:1937:            const newEmail = prompt("Editar Correo:", current.email);
  admin.html:1938:            if (newEmail === null) return;
  admin.html:1939:            
  admin.html:1940:            const newPass = prompt("Editar Contraseña de Aplicación:", current.password);
  admin.html:1941:            if (newPass === null) return;
  admin.html:1942:
  admin.html:1943:            if (!newEmail || !newPass) return alert("Los campos no pueden estar vacíos.");
  admin.html:1944:
  admin.html:1945:            db.ref('emailAccounts/' + key).update({
  admin.html:1946:                email: newEmail.trim(),
  admin.html:1947:                password: newPass.trim()
  admin.html:1948:            }).then(() => {
  admin.html:1949:                alert("Cuenta actualizada correctamente.");
  admin.html:1950:            });
  admin.html:1951:        }
  admin.html:1952:
  admin.html:1953:        window.deleteEmailAccount = function(key) {
  admin.html:1954:            if (confirm('¿Estás seguro de que quieres eliminar esta cuenta de correo? El lector de 
PIN dejará de funcionar para los clientes asociados a este email.')) {
  admin.html:1955:                db.ref('emailAccounts/' + key).remove();
  admin.html:1956:            }
  admin.html:1957:        }
  admin.html:1958:
  admin.html:1959:        async function loadMonthlySalesReport() {
  admin.html:1960:            const reportDiv = document.getElementById('monthly-sales-report');
  admin.html:1961:            if (!reportDiv) return;
  admin.html:1962:
  admin.html:1963:            reportDiv.innerHTML = '<p style="color:#ccc; text-align:center;">Cargando concentrado de 
ventas...</p>';
  admin.html:1964:
  admin.html:1965:            try {
  admin.html:1966:                const sellerSnap = await db.ref('sellerSales').once('value');
  admin.html:1967:                const sSales = sellerSnap.val() || {};
  admin.html:1968:
  admin.html:1969:                const monthlyTotals = {};
  admin.html:1970:                const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", 
"Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  admin.html:1971:
  admin.html:1972:                Object.keys(sSales).forEach(sellerName => {
  admin.html:1973:                    const sellerSalesObj = sSales[sellerName];
  admin.html:1974:                    Object.keys(sellerSalesObj).forEach(saleKey => {
  admin.html:1975:                        const sale = sellerSalesObj[saleKey];
  admin.html:1976:                        if (sale.isPaid !== false) {
  admin.html:1977:                            const d = new Date(sale.date);
  admin.html:1978:                            const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  admin.html:1979:                            // Use timestamp for sorting later
  admin.html:1980:                            const sortKey = d.getFullYear() * 100 + d.getMonth();
  admin.html:1981:
  admin.html:1982:                            if (!monthlyTotals[sortKey]) {
  admin.html:1983:                                monthlyTotals[sortKey] = { label: monthKey, total: 0 };
  admin.html:1984:                            }
  admin.html:1985:                            monthlyTotals[sortKey].total += (sale.total || 0);
  admin.html:1986:                        }
  admin.html:1987:                    });
  admin.html:1988:                });
  admin.html:1989:
  admin.html:1990:                let html = '<ul style="list-style:none; padding:0; margin:0;">';
  admin.html:1991:                const keys = Object.keys(monthlyTotals).map(Number).sort((a, b) => b - a);
  admin.html:1992:
  admin.html:1993:                if (keys.length === 0) {
  admin.html:1994:                    html += '<li style="color:#a0a0a0;">No hay ventas registradas o aprobadas 
aún.</li>';
  admin.html:1995:                } else {
  admin.html:1996:                    keys.forEach(k => {
  admin.html:1997:                        const data = monthlyTotals[k];
  admin.html:1998:                        html += `<li style="padding: 10px; border-bottom: 1px solid 
var(--glass-border); display: flex; justify-content: space-between;">
  admin.html:1999:                            <span style="color:white; font-weight:bold;">${data.label}</span>
  admin.html:2000:                            <span style="color:#4cd137; font-weight:bold; 
font-size:1.1rem;">$${data.total.toLocaleString()}</span>
  admin.html:2001:                        </li>`;
  admin.html:2002:                    });
  admin.html:2003:                }
  admin.html:2004:                html += '</ul>';
  admin.html:2005:                reportDiv.innerHTML = html;
  admin.html:2006:            } catch (e) {
  admin.html:2007:                console.error(e);
  admin.html:2008:                reportDiv.innerHTML = '<p style="color:#ff4d4d; text-align:center;">Error cargando 
el reporte.</p>';
  admin.html:2009:            }
  admin.html:2010:        }
  admin.html:2011:
  admin.html:2012:        let editIndex = -1;
  admin.html:2013:
  admin.html:2014:        async function downloadBackup() {
  admin.html:2015:            try {
  admin.html:2016:                const snap = await db.ref('/').once('value');
  admin.html:2017:                const data = snap.val();
  admin.html:2018:
  admin.html:2019:                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  admin.html:2020:                const url = URL.createObjectURL(blob);
  admin.html:2021:
  admin.html:2022:                const d = new Date();
  admin.html:2023:                const dd = String(d.getDate()).padStart(2, '0');
  admin.html:2024:                const mm = String(d.getMonth() + 1).padStart(2, '0');
  admin.html:2025:                const yyyy = d.getFullYear();
  admin.html:2026:
  admin.html:2027:                const a = document.createElement('a');
  admin.html:2028:                a.href = url;
  admin.html:2029:                a.download = `${dd}${mm}${yyyy}.json`;
  admin.html:2030:                document.body.appendChild(a);
  admin.html:2031:                a.click();
  admin.html:2032:                document.body.removeChild(a);
  admin.html:2033:                URL.revokeObjectURL(url);
  admin.html:2034:
  admin.html:2035:                alert('Copia de seguridad realizada con éxito. Guarda el archivo en la carpeta 
"F:\\Resp Antigravity".');
  admin.html:2036:            } catch (e) {
  admin.html:2037:                alert('Error al realizar el respaldo: ' + e.message);
  admin.html:2038:            }
  admin.html:2039:        }
  admin.html:2040:
  admin.html:2041:        function triggerRestoreBackup() {
  admin.html:2042:            if (confirm('⚠️ ADVERTENCIA: Restaurar un respaldo SOBREESCRIBIRÁ TODA la base de datos 
actual y perderás todos los clientes, ventas y configuraciones más recientes. ¿Estás seguro de continuar?')) {
  admin.html:2043:                document.getElementById('restore-backup-file').click();
  admin.html:2044:            }
  admin.html:2045:        }
  admin.html:2046:
  admin.html:2047:        function handleRestoreBackup(event) {
  admin.html:2048:            const file = event.target.files[0];
  admin.html:2049:            if (!file) return;
  admin.html:2050:
  admin.html:2051:            const reader = new FileReader();
  admin.html:2052:            reader.onload = async (e) => {
  admin.html:2053:                try {
  admin.html:2054:                    const data = JSON.parse(e.target.result);
  admin.html:2055:                    await db.ref('/').set(data);
  admin.html:2056:                    alert('¡Base de datos restaurada con éxito! La página se recargará.');
  admin.html:2057:                    window.location.reload();
  admin.html:2058:                } catch (err) {
  admin.html:2059:                    alert('Error al procesar el archivo. Asegúrate de que es un archivo JSON de 
respaldo válido.');
  admin.html:2060:                }
  admin.html:2061:            };
  admin.html:2062:            reader.readAsText(file);
  admin.html:2063:            event.target.value = ''; // Reset
  admin.html:2064:        }
  admin.html:2065:        let dynamicProducts = [];
  admin.html:2066:        let storeConfig = {
  admin.html:2067:            whatsappNumber: "573155182545",
  admin.html:2068:            paymentInfo: "*Medios de pago:*\n💳 Nequi o Daviplata: 3155182545\n🔑 Llave Nequi 
@NEQUICEC36\n🔑 Llave Daviplata @PLATA3155182545\n🔑 Llave Nu @CMA736\n🔑 Llave Be @BE346516",
  admin.html:2069:            discountEnabled: true,
  admin.html:2070:            discountAmount: 1000,
  admin.html:2071:            netflixEnabled: true,
  admin.html:2072:            disneyEnabled: true,
  admin.html:2073:            crmEnabled: true,
  admin.html:2074:            sellers: [],
  admin.html:2075:            estrenos: [],
  admin.html:2076:            reminderTemplate: "Hola {cliente} 😊 Buen dia\nTU {pantallas} finaliza \n👉 *HOY* 👈\n👉 
😱... \n⚠️ Si deseas continuar, realiza el pago y me envías la foto del comprobante🧾 (sin comprobante no cuenta como 
pago válido) ⚠️\n\n*Medios de Pago:*\n*Nequi o Daviplata 3155182545*\n\n*Llave Nequi @NEQUICEC36* \n*Llave Daviplata 
@PLATA3155182545* \n*Llave Nu @CMA736*\n*Llave Be @BE346516*"
  admin.html:2077:        };
  admin.html:2078:        let adminInitialized = false;
  admin.html:2079:        let editEstrenoIndex = -1;
  admin.html:2080:        let editSellerIndex = -1;
  admin.html:2081:        let allClientSalesMap = {}; // local copy for history
  admin.html:2082:
  admin.html:2083:        // Firebase Initialization
  admin.html:2084:        const firebaseConfig = {
  admin.html:2085:            apiKey: "AIzaSyBscP8FT1dcnHlSFMXc3DlfXSgRO9ET9s4",
  admin.html:2086:            authDomain: "streamingdpc-7e7fa.firebaseapp.com",
  admin.html:2087:            databaseURL: "https://streamingdpc-7e7fa-default-rtdb.firebaseio.com",
  admin.html:2088:            projectId: "streamingdpc-7e7fa",
  admin.html:2089:            storageBucket: "streamingdpc-7e7fa.firebasestorage.app",
  admin.html:2090:            messagingSenderId: "831116907849",
  admin.html:2091:            appId: "1:831116907849:web:ee8e744db342970fd0b698"
  admin.html:2092:        };
  admin.html:2093:
  admin.html:2094:        if (!firebase.apps.length) {
  admin.html:2095:            firebase.initializeApp(firebaseConfig);
  admin.html:2096:        }
  admin.html:2097:        const db = firebase.database();
  admin.html:2098:    window.sanitizePhone = function(val) {
  admin.html:2099:        if(!val) return '';
  admin.html:2100:        let c = val.toString().replace(/\D/g, '');
  admin.html:2101:        if(c.length >= 12 && c.startsWith('57')) {
  admin.html:2102:            c = c.substring(2);
  admin.html:2103:        }
  admin.html:2104:        return c;
  admin.html:2105:    };
  admin.html:2106:
  admin.html:2107:
  admin.html:2108:        function safeDecode(str) {
  admin.html:2109:            if (!str) return '';
  admin.html:2110:            try {
  admin.html:2111:                // Si contiene %, intentamos decodificar. 
  admin.html:2112:                // Si falla, devolvemos el original.
  admin.html:2113:                return str.includes('%') ? decodeURIComponent(str) : str;
  admin.html:2114:            } catch (e) { return str; }
  admin.html:2115:        }
  admin.html:2116:
  admin.html:2117:        db.ref('/').on('value', (snap) => {
  admin.html:2118:            const data = snap.val();
  admin.html:2119:            console.log("Firebase snapshot received:", data);
  admin.html:2120:            if (data) {
  admin.html:2121:                dynamicProducts = Array.isArray(data.products) ? data.products : 
Object.values(data.products || {});
  admin.html:2122:                storeConfig = data.storeConfig || storeConfig;
  admin.html:2123:                window.allClientProfiles = data.clientProfiles || {};
  admin.html:2124:                allClientProfiles = window.allClientProfiles;
  admin.html:2125:                window.allClientSalesMap = data.clientSales || {};
  admin.html:2126:                allClientSalesMap = window.allClientSalesMap;
  admin.html:2127:                window.globalSellerSalesDataStore = data.sellerSales || {};
  admin.html:2128:                globalSellerSalesDataStore = window.globalSellerSalesDataStore;
  admin.html:2129:                
  admin.html:2130:                if (!adminInitialized) {
  admin.html:2131:                    adminInitialized = true;
  admin.html:2132:                    init();
  admin.html:2133:                } else {
  admin.html:2134:                    renderAdminList();
  admin.html:2135:                    renderEstrenosList();
  admin.html:2136:                    renderBannersList();
  admin.html:2137:                    renderSellersList();
  admin.html:2138:                    renderBlockedClients();
  admin.html:2139:                    renderManualClientProducts();
  admin.html:2140:                    renderAllClientsList();
  admin.html:2141:                    renderSellerSalesStats();
  admin.html:2142:                }
  admin.html:2143:            } else {
  admin.html:2144:                console.warn("Snapshot is EMPTY (null)!");
  admin.html:2145:            }
  admin.html:2146:        }, (error) => {
  admin.html:2147:            console.error("Firebase listener error:", error);
  admin.html:2148:        });
  admin.html:2149:        function init() {
  admin.html:2150:            try {
  admin.html:2151:                console.log("Initializing Admin UI...");
  admin.html:2152:                renderAdminList();
  admin.html:2153:                renderEstrenosList();
  admin.html:2154:                renderBannersList();
  admin.html:2155:                renderSellersList();
  admin.html:2156:                renderBlockedClients();
  admin.html:2157:
  admin.html:2158:            // Llenar config
  admin.html:2159:            document.getElementById('conf-whatsapp').value = storeConfig.whatsappNumber || '';
  admin.html:2160:            if (document.getElementById('conf-facebook')) 
document.getElementById('conf-facebook').value = storeConfig.facebookUrl || '';
  admin.html:2161:            if (document.getElementById('conf-instagram')) 
document.getElementById('conf-instagram').value = storeConfig.instagramUrl || '';
  admin.html:2162:            if (document.getElementById('conf-tiktok')) document.getElementById('conf-tiktok').value 
= storeConfig.tiktokUrl || '';
  admin.html:2163:            if (document.getElementById('conf-kwai')) document.getElementById('conf-kwai').value = 
storeConfig.kwaiUrl || '';
  admin.html:2164:            if (document.getElementById('conf-youtube')) 
document.getElementById('conf-youtube').value = storeConfig.youtubeUrl || '';
  admin.html:2165:
  admin.html:2166:            document.getElementById('conf-paymentInfo').value = storeConfig.paymentInfo || '';
  admin.html:2167:            if (document.getElementById('conf-discountEnabled')) {
  admin.html:2168:                document.getElementById('conf-discountEnabled').value = (storeConfig.discountEnabled 
!== false).toString();
  admin.html:2169:            }
  admin.html:2170:            if (document.getElementById('conf-discountAmount')) {
  admin.html:2171:                document.getElementById('conf-discountAmount').value = storeConfig.discountAmount || 
0;
  admin.html:2172:            }
  admin.html:2173:
  admin.html:2174:            if (document.getElementById('conf-capMonthPolicyTemplate')) 
document.getElementById('conf-capMonthPolicyTemplate').value = storeConfig.capMonthPolicyTemplate || `Hola 
*{cliente}*, 📢 *Actualización de Servicio*:\n\nHemos unificado las fechas de corte. *Tu día de pago ya no se moverá 
mes a mes*; ahora se renovará el mismo día de tu fecha de compra original.\n\nEn meses cortos (de 30 días o febrero), 
el sistema pondrá el vencimiento el último día del mes de forma automática y lo recuperará al mes 
siguiente.\n\nGracias por tu confianza.`;
  admin.html:2175:            if (document.getElementById('conf-reminderTemplate')) {
  admin.html:2176:                document.getElementById('conf-reminderTemplate').value = 
storeConfig.reminderTemplate || "Hola {cliente} 😊 Buen dia\nTU {pantallas} finaliza \n👉 *HOY* 👈\n👉 😱... \n⚠️ Si 
deseas continuar, realiza el pago y me envías la foto del comprobante🧾 (sin comprobante no cuenta como pago válido) 
⚠️\n\n*Medios de Pago:*\n*Nequi o Daviplata 3155182545*\n\n*Llave Nequi @NEQUICEC36* \n*Llave Daviplata 
@PLATA3155182545* \n*Llave Nu @CMA736*\n*Llave Be @BE346516*";
  admin.html:2177:            }
  admin.html:2178:
  admin.html:2179:            if (document.getElementById('conf-netflixEnabled')) 
document.getElementById('conf-netflixEnabled').value = storeConfig.netflixEnabled !== false ? 'true' : 'false';
  admin.html:2180:            if (document.getElementById('conf-disneyEnabled')) 
document.getElementById('conf-disneyEnabled').value = storeConfig.disneyEnabled !== false ? 'true' : 'false';
  admin.html:2181:
  admin.html:2182:            if (document.getElementById('conf-autoReminderEnabled')) 
document.getElementById('conf-autoReminderEnabled').value = storeConfig.autoReminderEnabled === false ? "false" : 
"true";
  admin.html:2183:            if (document.getElementById('conf-autoReminderTomorrowEnabled')) 
document.getElementById('conf-autoReminderTomorrowEnabled').value = storeConfig.autoReminderTomorrowEnabled === false 
? "false" : "true";
  admin.html:2184:            if (document.getElementById('conf-autoReminderHour')) 
document.getElementById('conf-autoReminderHour').value = storeConfig.autoReminderHour || "0";
  admin.html:2185:            if (document.getElementById('conf-reminderTomorrowTemplate')) {
  admin.html:2186:                document.getElementById('conf-reminderTomorrowTemplate').value = 
storeConfig.reminderTomorrowTemplate || "Hola {cliente} 😊 Buen dia\nTe avisamos que TU {pantallas} finaliza \n👉 
*MAÑANA* 👈\n⚠️ Para evitar la suspensión, por favor realiza el pago con tiempo ⚠️";
  admin.html:2187:            }
  admin.html:2188:            if (document.getElementById('conf-sellerReminderTemplate')) {
  admin.html:2189:                document.getElementById('conf-sellerReminderTemplate').value = 
storeConfig.sellerReminderTemplate || "Hola *{vendedor}* 👋\n\nTe recuerdo que la cuenta de tu cliente *{cliente}* (📱 
{celular})\n\nCon: {pantallas}\n👉 *FINALIZA PRONTO o YA VENCIÓ* 👈\n\nPor favor contáctalo para gestionar su 
renovación.\n\nCelular: {celular} y Pin: {pin}\n💰 *Total:* ${total}";
  admin.html:2190:            }
  admin.html:2191:            if (document.getElementById('conf-sellerReminderTomorrowTemplate')) {
  admin.html:2192:                document.getElementById('conf-sellerReminderTomorrowTemplate').value = 
storeConfig.sellerReminderTomorrowTemplate || "Hola *{vendedor}* 👋\n\nTe damos Aviso Previo que la cuenta de tu 
cliente *{cliente}* (📱 {celular})\n\nCon: {pantallas}\n👉 *FINALIZA MAÑANA* 👈\n\nPor favor contáctalo para gestionar 
su renovación y evitar cortes.\n\nCelular: {celular} y Pin: {pin}\n💰 *Total:* ${total}";
  admin.html:2193:            }
  admin.html:2194:            
  admin.html:2195:            if (document.getElementById('conf-renovadaSingularTemplate')) {
  admin.html:2196:                document.getElementById('conf-renovadaSingularTemplate').value = 
storeConfig.renovadaSingularTemplate || "♦️♦️♦️ ** Tu Pantalla de *{pantallas}* ha sido Renovada* con los mismos datos 
que tenga buen día que la disfrute ♦️♦️♦️ *vence {mes}*";
  admin.html:2197:            }
  admin.html:2198:            if (document.getElementById('conf-renovadaPluralTemplate')) {
  admin.html:2199:                document.getElementById('conf-renovadaPluralTemplate').value = 
storeConfig.renovadaPluralTemplate || "♦️♦️♦️ ** Tus Pantallas de *{pantallas}* han sido Renovadas* con los mismos 
datos que tenga buen día que la disfrute ♦️♦️♦️ *vence {mes}*";
  admin.html:2200:            }
  admin.html:2201:
  admin.html:2202:            if (document.getElementById('conf-sellerPassword')) 
document.getElementById('conf-sellerPassword').value = storeConfig.sellerPassword || 'admin';
  admin.html:2203:            if (document.getElementById('conf-adminPassword')) 
document.getElementById('conf-adminPassword').value = storeConfig.adminPassword || 'admin123';
  admin.html:2204:
  admin.html:2205:            if (document.getElementById('conf-sellerDiscountEnabled')) 
document.getElementById('conf-sellerDiscountEnabled').value = storeConfig.sellerDiscountEnabled === true ? 'true' : 
'false';
  admin.html:2206:            if (document.getElementById('conf-sellerDiscountAmount')) 
document.getElementById('conf-sellerDiscountAmount').value = storeConfig.sellerDiscountAmount || 0;
  admin.html:2207:            if (document.getElementById('conf-clientBannerEnabled')) 
document.getElementById('conf-clientBannerEnabled').value = storeConfig.clientBannerEnabled === true ? 'true' : 
'false';
  admin.html:2208:            if (document.getElementById('conf-clientBannerText')) 
document.getElementById('conf-clientBannerText').value = storeConfig.clientBannerText || '';
  admin.html:2209:            if (document.getElementById('conf-sellerBannerEnabled')) 
document.getElementById('conf-sellerBannerEnabled').value = storeConfig.sellerBannerEnabled === true ? 'true' : 
'false';
  admin.html:2210:            if (document.getElementById('conf-sellerBannerText')) 
document.getElementById('conf-sellerBannerText').value = storeConfig.sellerBannerText || '';
  admin.html:2211:
  admin.html:2212:            if (document.getElementById('conf-mainBannerEnabled')) 
document.getElementById('conf-mainBannerEnabled').value = storeConfig.mainBannerEnabled === true ? 'true' : 'false';
  admin.html:2213:            if (document.getElementById('conf-mainBannerBadge')) 
document.getElementById('conf-mainBannerBadge').value = storeConfig.mainBannerBadge || '';
  admin.html:2214:            if (document.getElementById('conf-mainBannerTitle')) 
document.getElementById('conf-mainBannerTitle').value = storeConfig.mainBannerTitle || '';
  admin.html:2215:            if (document.getElementById('conf-mainBannerDesc')) 
document.getElementById('conf-mainBannerDesc').value = storeConfig.mainBannerDesc || '';
  admin.html:2216:            if (document.getElementById('conf-mainBannerImage')) 
document.getElementById('conf-mainBannerImage').value = storeConfig.mainBannerImage || '';
  admin.html:2217:            if (document.getElementById('conf-mainBannerBtnText')) 
document.getElementById('conf-mainBannerBtnText').value = storeConfig.mainBannerBtnText || '';
  admin.html:2218:            if (document.getElementById('conf-mainBannerBtnLink')) 
document.getElementById('conf-mainBannerBtnLink').value = storeConfig.mainBannerBtnLink || '';
  admin.html:2219:
  admin.html:2220:            if (document.getElementById('conf-clientPromoDiscount')) 
document.getElementById('conf-clientPromoDiscount').value = storeConfig.clientPromoDiscount || 0;
  admin.html:2221:            if (document.getElementById('conf-clientPromoLimit')) 
document.getElementById('conf-clientPromoLimit').value = storeConfig.clientPromoLimit || 0;
  admin.html:2222:            if (document.getElementById('conf-sellerPromoDiscount')) 
document.getElementById('conf-sellerPromoDiscount').value = storeConfig.sellerPromoDiscount || 0;
  admin.html:2223:            if (document.getElementById('conf-sellerPromoLimit')) 
document.getElementById('conf-sellerPromoLimit').value = storeConfig.sellerPromoLimit || 0;
  admin.html:2224:
  admin.html:2225:            if (document.getElementById('conf-incentiveEnabled')) 
document.getElementById('conf-incentiveEnabled').value = storeConfig.incentiveEnabled === true ? 'true' : 'false';
  admin.html:2226:            if (document.getElementById('conf-incentiveMessage')) 
document.getElementById('conf-incentiveMessage').value = storeConfig.incentiveMessage || '';
  admin.html:2227:            if (document.getElementById('conf-incentiveNetflix')) 
document.getElementById('conf-incentiveNetflix').value = storeConfig.incentiveNetflix || 0;
  admin.html:2228:            if (document.getElementById('conf-incentiveNetflixPrivada')) 
document.getElementById('conf-incentiveNetflixPrivada').value = storeConfig.incentiveNetflixPrivada || 0;
  admin.html:2229:            if (document.getElementById('conf-incentiveDisney')) 
document.getElementById('conf-incentiveDisney').value = storeConfig.incentiveDisney || 0;
  admin.html:2230:            if (document.getElementById('conf-incentiveHbo')) 
document.getElementById('conf-incentiveHbo').value = storeConfig.incentiveHbo || storeConfig.incentiveMax || 0;
  admin.html:2231:            if (document.getElementById('conf-incentivePrime')) 
document.getElementById('conf-incentivePrime').value = storeConfig.incentivePrime || 0;
  admin.html:2232:            if (document.getElementById('conf-incentiveParamount')) 
document.getElementById('conf-incentiveParamount').value = storeConfig.incentiveParamount || 0;
  admin.html:2233:            if (document.getElementById('conf-incentiveVix')) 
document.getElementById('conf-incentiveVix').value = storeConfig.incentiveVix || 0;
  admin.html:2234:            if (document.getElementById('conf-incentiveIptv')) 
document.getElementById('conf-incentiveIptv').value = storeConfig.incentiveIptv || 0;
  admin.html:2235:            if (document.getElementById('conf-incentiveCrunchyroll')) 
document.getElementById('conf-incentiveCrunchyroll').value = storeConfig.incentiveCrunchyroll || 0;
  admin.html:2236:            if (document.getElementById('conf-incentiveApple')) 
document.getElementById('conf-incentiveApple').value = storeConfig.incentiveApple || 0;
  admin.html:2237:            if (document.getElementById('conf-incentiveCombo2')) 
document.getElementById('conf-incentiveCombo2').value = storeConfig.incentiveCombo2 || 0;
  admin.html:2238:            if (document.getElementById('conf-incentiveCombo3')) 
document.getElementById('conf-incentiveCombo3').value = storeConfig.incentiveCombo3 || 0;
  admin.html:2239:            if (document.getElementById('conf-incentiveCombo4')) 
document.getElementById('conf-incentiveCombo4').value = storeConfig.incentiveCombo4 || 0;
  admin.html:2240:            if (document.getElementById('conf-incentiveCombo5')) 
document.getElementById('conf-incentiveCombo5').value = storeConfig.incentiveCombo5 || 0;
  admin.html:2241:            if (document.getElementById('conf-incentiveFinde')) 
document.getElementById('conf-incentiveFinde').value = storeConfig.incentiveFinde || 0;
  admin.html:2242:            if (document.getElementById('conf-incentiveMes')) 
document.getElementById('conf-incentiveMes').value = storeConfig.incentiveMes || 0;
  admin.html:2243:
  admin.html:2244:            if (document.getElementById('conf-tabOrder')) {
  admin.html:2245:                document.getElementById('conf-tabOrder').value = (storeConfig && 
storeConfig.tabOrder) ? storeConfig.tabOrder.join(',') : 
'individual,ventas_extras,combos2,combos3,combos4,combos5,promociones_finde,promociones,all';
  admin.html:2246:            }
  admin.html:2247:            if (document.getElementById('conf-nequiEnabled')) 
document.getElementById('conf-nequiEnabled').value = (storeConfig && storeConfig.nequiEnabled !== false) ? 'true' : 
'false';
  admin.html:2248:            if (document.getElementById('conf-nequiLabel')) 
document.getElementById('conf-nequiLabel').value = (storeConfig && storeConfig.nequiLabel) || '';
  admin.html:2249:            if (document.getElementById('conf-nequiImg')) 
document.getElementById('conf-nequiImg').value = (storeConfig && storeConfig.nequiImg) || '';
  admin.html:2250:
  admin.html:2251:            if (document.getElementById('conf-nuEnabled')) 
document.getElementById('conf-nuEnabled').value = (storeConfig && storeConfig.nuEnabled !== false) ? 'true' : 'false';
  admin.html:2252:            if (document.getElementById('conf-nuLabel')) 
document.getElementById('conf-nuLabel').value = (storeConfig && storeConfig.nuLabel) || '';
  admin.html:2253:            if (document.getElementById('conf-nuImg')) document.getElementById('conf-nuImg').value = 
(storeConfig && storeConfig.nuImg) || '';
  admin.html:2254:            
  admin.html:2255:            // CRM Messaging config
  admin.html:2256:            if (document.getElementById('conf-msgTemplate1')) 
document.getElementById('conf-msgTemplate1').value = storeConfig.msgTemplate1 || '';
  admin.html:2257:            if (document.getElementById('conf-msgTemplate2')) 
document.getElementById('conf-msgTemplate2').value = storeConfig.msgTemplate2 || '';
  admin.html:2258:            if (document.getElementById('main-conf-crmEnabled')) {
  admin.html:2259:                document.getElementById('main-conf-crmEnabled').value = storeConfig.crmEnabled === 
false ? 'false' : 'true';
  admin.html:2260:            }
  admin.html:2261:            if (document.getElementById('conf-sendOnlyStep1')) 
document.getElementById('conf-sendOnlyStep1').value = storeConfig.sendOnlyStep1 === true ? 'true' : 'false';
  admin.html:2262:            if (document.getElementById('conf-msgDiscountAmount')) 
document.getElementById('conf-msgDiscountAmount').value = storeConfig.msgDiscountAmount || 0;
  admin.html:2263:            if (document.getElementById('conf-useLocalRobotCRM')) 
document.getElementById('conf-useLocalRobotCRM').value = storeConfig.useLocalRobotCRM === true ? 'true' : 'false';
  admin.html:2264:            renderMsgPhotoGallery();
  admin.html:2265:            
  admin.html:2266:            renderAllClientsList();
  admin.html:2267:            renderSellerSalesStats();
  admin.html:2268:
  admin.html:2269:            // Check auto reminders schedule
  admin.html:2270:            setTimeout(checkDailyAutoReminders, 2000); // 2 sec delay to ensure all setups finish
  admin.html:2271:            } catch (err) {
  admin.html:2272:                console.error("Critical error during init:", err);
  admin.html:2273:            }
  admin.html:2274:        }
  admin.html:2275:
  admin.html:2276:        function switchTab(tabId, btn) {
  admin.html:2277:            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  admin.html:2278:            document.querySelectorAll('.admin-tab').forEach(el => el.classList.remove('active'));
  admin.html:2279:
  admin.html:2280:            document.getElementById('tab-' + tabId).classList.add('active');
  admin.html:2281:            btn.classList.add('active');
  admin.html:2282:        }
  admin.html:2283:
  admin.html:2284:        function showSubConf(subId, btn) {
  admin.html:2285:            document.querySelectorAll('.sub-conf-content').forEach(el => el.style.display = 'none');
  admin.html:2286:            const target = document.getElementById('sub-conf-' + subId);
  admin.html:2287:            if (target) target.style.display = 'block';
  admin.html:2288:
  admin.html:2289:            document.querySelectorAll('.sub-conf-btn').forEach(el => {
  admin.html:2290:                el.style.background = 'var(--glass)';
  admin.html:2291:                el.style.color = 'var(--text-secondary)';
  admin.html:2292:            });
  admin.html:2293:            btn.style.background = 'white';
  admin.html:2294:            btn.style.color = 'black';
  admin.html:2295:        }
  admin.html:2296:
  admin.html:2297:        async function saveConfig() {
  admin.html:2298:            try {
  admin.html:2299:                // Generales
  admin.html:2300:                storeConfig.whatsappNumber = document.getElementById('conf-whatsapp').value;
  admin.html:2301:                if (document.getElementById('conf-facebook')) storeConfig.facebookUrl = 
document.getElementById('conf-facebook').value;
  admin.html:2302:                if (document.getElementById('conf-instagram')) storeConfig.instagramUrl = 
document.getElementById('conf-instagram').value;
  admin.html:2303:                if (document.getElementById('conf-tiktok')) storeConfig.tiktokUrl = 
document.getElementById('conf-tiktok').value;
  admin.html:2304:                if (document.getElementById('conf-kwai')) storeConfig.kwaiUrl = 
document.getElementById('conf-kwai').value;
  admin.html:2305:                if (document.getElementById('conf-youtube')) storeConfig.youtubeUrl = 
document.getElementById('conf-youtube').value;
  admin.html:2306:                
  admin.html:2307:                storeConfig.paymentInfo = document.getElementById('conf-paymentInfo').value;
  admin.html:2308:                storeConfig.discountEnabled = document.getElementById('conf-discountEnabled').value 
=== "true";
  admin.html:2309:                storeConfig.discountAmount = 
parseInt(document.getElementById('conf-discountAmount').value) || 0;
  admin.html:2310:
  admin.html:2311:                if (document.getElementById('conf-reminderTemplate')) {
  admin.html:2312:                    storeConfig.reminderTemplate = 
document.getElementById('conf-reminderTemplate').value;
  admin.html:2313:                if(document.getElementById('conf-capMonthPolicyTemplate')) 
storeConfig.capMonthPolicyTemplate = document.getElementById('conf-capMonthPolicyTemplate').value;
  admin.html:2314:                if(document.getElementById('conf-capMonthPolicyTemplate')) 
storeConfig.capMonthPolicyTemplate = document.getElementById('conf-capMonthPolicyTemplate').value;
  admin.html:2315:                }
  admin.html:2316:
  admin.html:2317:                storeConfig.netflixEnabled = document.getElementById('conf-netflixEnabled').value 
=== "true";
  admin.html:2318:                storeConfig.disneyEnabled = document.getElementById('conf-disneyEnabled').value === 
"true";
  admin.html:2319:
  admin.html:2320:                storeConfig.autoReminderEnabled = 
document.getElementById('conf-autoReminderEnabled').value === "true";
  admin.html:2321:                if (document.getElementById('conf-autoReminderTomorrowEnabled')) 
storeConfig.autoReminderTomorrowEnabled = document.getElementById('conf-autoReminderTomorrowEnabled').value === "true";
  admin.html:2322:                storeConfig.autoReminderHour = 
document.getElementById('conf-autoReminderHour').value || "0";
  admin.html:2323:                
  admin.html:2324:                if (document.getElementById('conf-reminderTomorrowTemplate')) {
  admin.html:2325:                    storeConfig.reminderTomorrowTemplate = 
document.getElementById('conf-reminderTomorrowTemplate').value;
  admin.html:2326:                }
  admin.html:2327:                
  admin.html:2328:                if (document.getElementById('conf-sellerReminderTemplate')) {
  admin.html:2329:                    storeConfig.sellerReminderTemplate = 
document.getElementById('conf-sellerReminderTemplate').value;
  admin.html:2330:                }
  admin.html:2331:                if (document.getElementById('conf-sellerReminderTomorrowTemplate')) {
  admin.html:2332:                    storeConfig.sellerReminderTomorrowTemplate = 
document.getElementById('conf-sellerReminderTomorrowTemplate').value;
  admin.html:2333:                }
  admin.html:2334:                if (document.getElementById('conf-renovadaSingularTemplate')) {
  admin.html:2335:                    storeConfig.renovadaSingularTemplate = 
document.getElementById('conf-renovadaSingularTemplate').value;
  admin.html:2336:                }
  admin.html:2337:                if (document.getElementById('conf-renovadaPluralTemplate')) {
  admin.html:2338:                    storeConfig.renovadaPluralTemplate = 
document.getElementById('conf-renovadaPluralTemplate').value;
  admin.html:2339:                }
  admin.html:2340:
  admin.html:2341:                if (document.getElementById('conf-sellerPassword')) storeConfig.sellerPassword = 
document.getElementById('conf-sellerPassword').value;
  admin.html:2342:                if (document.getElementById('conf-adminPassword')) storeConfig.adminPassword = 
document.getElementById('conf-adminPassword').value;
  admin.html:2343:
  admin.html:2344:                if (document.getElementById('conf-sellerDiscountEnabled')) 
storeConfig.sellerDiscountEnabled = document.getElementById('conf-sellerDiscountEnabled').value === "true";
  admin.html:2345:                if (document.getElementById('conf-sellerDiscountAmount')) 
storeConfig.sellerDiscountAmount = parseInt(document.getElementById('conf-sellerDiscountAmount').value) || 0;
  admin.html:2346:                
  admin.html:2347:                if (document.getElementById('conf-clientBannerEnabled')) 
storeConfig.clientBannerEnabled = document.getElementById('conf-clientBannerEnabled').value === "true";
  admin.html:2348:                if (document.getElementById('conf-clientBannerText')) storeConfig.clientBannerText = 
document.getElementById('conf-clientBannerText').value;
  admin.html:2349:                if (document.getElementById('conf-sellerBannerEnabled')) 
storeConfig.sellerBannerEnabled = document.getElementById('conf-sellerBannerEnabled').value === "true";
  admin.html:2350:                if (document.getElementById('conf-sellerBannerText')) storeConfig.sellerBannerText = 
document.getElementById('conf-sellerBannerText').value;
  admin.html:2351:
  admin.html:2352:                if (document.getElementById('conf-mainBannerEnabled')) storeConfig.mainBannerEnabled 
= document.getElementById('conf-mainBannerEnabled').value === "true";
  admin.html:2353:                if (document.getElementById('conf-mainBannerBadge')) storeConfig.mainBannerBadge = 
document.getElementById('conf-mainBannerBadge').value;
  admin.html:2354:                if (document.getElementById('conf-mainBannerTitle')) storeConfig.mainBannerTitle = 
document.getElementById('conf-mainBannerTitle').value;
  admin.html:2355:                if (document.getElementById('conf-mainBannerDesc')) storeConfig.mainBannerDesc = 
document.getElementById('conf-mainBannerDesc').value;
  admin.html:2356:                if (document.getElementById('conf-mainBannerImage')) storeConfig.mainBannerImage = 
document.getElementById('conf-mainBannerImage').value;
  admin.html:2357:                if (document.getElementById('conf-mainBannerBtnText')) storeConfig.mainBannerBtnText 
= document.getElementById('conf-mainBannerBtnText').value;
  admin.html:2358:                if (document.getElementById('conf-mainBannerBtnLink')) storeConfig.mainBannerBtnLink 
= document.getElementById('conf-mainBannerBtnLink').value;
  admin.html:2359:
  admin.html:2360:                if (document.getElementById('conf-clientPromoDiscount')) 
storeConfig.clientPromoDiscount = parseInt(document.getElementById('conf-clientPromoDiscount').value) || 0;
  admin.html:2361:                if (document.getElementById('conf-clientPromoLimit')) storeConfig.clientPromoLimit = 
parseInt(document.getElementById('conf-clientPromoLimit').value) || 0;
  admin.html:2362:                if (document.getElementById('conf-sellerPromoDiscount')) 
storeConfig.sellerPromoDiscount = parseInt(document.getElementById('conf-sellerPromoDiscount').value) || 0;
  admin.html:2363:                if (document.getElementById('conf-sellerPromoLimit')) storeConfig.sellerPromoLimit = 
parseInt(document.getElementById('conf-sellerPromoLimit').value) || 0;
  admin.html:2364:
  admin.html:2365:                if (document.getElementById('conf-incentiveEnabled')) storeConfig.incentiveEnabled = 
document.getElementById('conf-incentiveEnabled').value === "true";
  admin.html:2366:                if (document.getElementById('conf-incentiveMessage')) storeConfig.incentiveMessage = 
document.getElementById('conf-incentiveMessage').value;
  admin.html:2367:                if (document.getElementById('conf-incentiveNetflix')) storeConfig.incentiveNetflix = 
parseInt(document.getElementById('conf-incentiveNetflix').value) || 0;
  admin.html:2368:                if (document.getElementById('conf-incentiveNetflixPrivada')) 
storeConfig.incentiveNetflixPrivada = parseInt(document.getElementById('conf-incentiveNetflixPrivada').value) || 0;
  admin.html:2369:                if (document.getElementById('conf-incentiveDisney')) storeConfig.incentiveDisney = 
parseInt(document.getElementById('conf-incentiveDisney').value) || 0;
  admin.html:2370:                if (document.getElementById('conf-incentiveHbo')) storeConfig.incentiveHbo = 
parseInt(document.getElementById('conf-incentiveHbo').value) || 0;
  admin.html:2371:                if (document.getElementById('conf-incentivePrime')) storeConfig.incentivePrime = 
parseInt(document.getElementById('conf-incentivePrime').value) || 0;
  admin.html:2372:                if (document.getElementById('conf-incentiveParamount')) 
storeConfig.incentiveParamount = parseInt(document.getElementById('conf-incentiveParamount').value) || 0;
  admin.html:2373:                if (document.getElementById('conf-incentiveVix')) storeConfig.incentiveVix = 
parseInt(document.getElementById('conf-incentiveVix').value) || 0;
  admin.html:2374:                if (document.getElementById('conf-incentiveIptv')) storeConfig.incentiveIptv = 
parseInt(document.getElementById('conf-incentiveIptv').value) || 0;
  admin.html:2375:                if (document.getElementById('conf-incentiveCrunchyroll')) 
storeConfig.incentiveCrunchyroll = parseInt(document.getElementById('conf-incentiveCrunchyroll').value) || 0;
  admin.html:2376:                if (document.getElementById('conf-incentiveApple')) storeConfig.incentiveApple = 
parseInt(document.getElementById('conf-incentiveApple').value) || 0;
  admin.html:2377:                if (document.getElementById('conf-incentiveCombo2')) storeConfig.incentiveCombo2 = 
parseInt(document.getElementById('conf-incentiveCombo2').value) || 0;
  admin.html:2378:                if (document.getElementById('conf-incentiveCombo3')) storeConfig.incentiveCombo3 = 
parseInt(document.getElementById('conf-incentiveCombo3').value) || 0;
  admin.html:2379:                if (document.getElementById('conf-incentiveCombo4')) storeConfig.incentiveCombo4 = 
parseInt(document.getElementById('conf-incentiveCombo4').value) || 0;
  admin.html:2380:                if (document.getElementById('conf-incentiveCombo5')) storeConfig.incentiveCombo5 = 
parseInt(document.getElementById('conf-incentiveCombo5').value) || 0;
  admin.html:2381:                if (document.getElementById('conf-incentiveFinde')) storeConfig.incentiveFinde = 
parseInt(document.getElementById('conf-incentiveFinde').value) || 0;
  admin.html:2382:                if (document.getElementById('conf-incentiveMes')) storeConfig.incentiveMes = 
parseInt(document.getElementById('conf-incentiveMes').value) || 0;
  admin.html:2383:
  admin.html:2384:                if (document.getElementById('conf-tabOrder')) {
  admin.html:2385:                    storeConfig.tabOrder = 
document.getElementById('conf-tabOrder').value.split(',').map(s => s.trim());
  admin.html:2386:                }
  admin.html:2387:                if (document.getElementById('conf-nequiEnabled')) storeConfig.nequiEnabled = 
document.getElementById('conf-nequiEnabled').value === "true";
  admin.html:2388:                if (document.getElementById('conf-nequiLabel')) storeConfig.nequiLabel = 
document.getElementById('conf-nequiLabel').value;
  admin.html:2389:                if (document.getElementById('conf-nequiImg')) storeConfig.nequiImg = 
document.getElementById('conf-nequiImg').value;
  admin.html:2390:
  admin.html:2391:                if (document.getElementById('conf-nuEnabled')) storeConfig.nuEnabled = 
document.getElementById('conf-nuEnabled').value === "true";
  admin.html:2392:                if (document.getElementById('conf-nuLabel')) storeConfig.nuLabel = 
document.getElementById('conf-nuLabel').value;
  admin.html:2393:                if (document.getElementById('conf-nuImg')) storeConfig.nuImg = 
document.getElementById('conf-nuImg').value;
  admin.html:2394:                
  admin.html:2395:                // CRM Logic persistence
  admin.html:2396:                if (document.getElementById('main-conf-crmEnabled')) {
  admin.html:2397:                    storeConfig.crmEnabled = document.getElementById('main-conf-crmEnabled').value 
=== "true";
  admin.html:2398:                }
  admin.html:2399:                if (document.getElementById('conf-msgTemplate1')) storeConfig.msgTemplate1 = 
document.getElementById('conf-msgTemplate1').value;
  admin.html:2400:                if (document.getElementById('conf-msgTemplate2')) storeConfig.msgTemplate2 = 
document.getElementById('conf-msgTemplate2').value;
  admin.html:2401:                if (document.getElementById('conf-sendOnlyStep1')) storeConfig.sendOnlyStep1 = 
document.getElementById('conf-sendOnlyStep1').value === "true";
  admin.html:2402:                if (document.getElementById('conf-msgDiscountAmount')) storeConfig.msgDiscountAmount 
= parseInt(document.getElementById('conf-msgDiscountAmount').value) || 0;
  admin.html:2403:                if (document.getElementById('conf-useLocalRobotCRM')) storeConfig.useLocalRobotCRM = 
document.getElementById('conf-useLocalRobotCRM').value === "true";
  admin.html:2404:
  admin.html:2405:                await db.ref('storeConfig').set(storeConfig);
  admin.html:2406:                alert('¡Configuración guardada exitosamente en la base de datos!');
  admin.html:2407:            } catch (err) {
  admin.html:2408:                console.error(err);
  admin.html:2409:                alert('Error al guardar configuración: ' + err.message);
  admin.html:2410:            }
  admin.html:2411:        }
  admin.html:2412:
  admin.html:2413:        function populateOwnerSelect() {
  admin.html:2414:            const ownerSelect = document.getElementById('new-owner');
  admin.html:2415:            if (ownerSelect) {
  admin.html:2416:                const currentVal = ownerSelect.value;
  admin.html:2417:                ownerSelect.innerHTML = '<option value="admin">Administrador (Global)</option>';
  admin.html:2418:                let sellersRaw = storeConfig.sellers || [];
  admin.html:2419:                const sellers = Array.isArray(sellersRaw) ? sellersRaw : Object.values(sellersRaw);
  admin.html:2420:                sellers.forEach(s => {
  admin.html:2421:                    const opt = document.createElement('option');
  admin.html:2422:                    opt.value = s.name;
  admin.html:2423:                    opt.text = 'Vendedor: ' + s.name;
  admin.html:2424:                    ownerSelect.appendChild(opt);
  admin.html:2425:                });
  admin.html:2426:                if (currentVal && Array.from(ownerSelect.options).some(o => o.value === currentVal)) 
{
  admin.html:2427:                    ownerSelect.value = currentVal;
  admin.html:2428:                } else {
  admin.html:2429:                    ownerSelect.value = 'admin';
  admin.html:2430:                }
  admin.html:2431:            }
  admin.html:2432:
  admin.html:2433:            const allowSelect = document.getElementById('new-allow-exhausted-seller');
  admin.html:2434:            if (allowSelect) {
  admin.html:2435:                const currentAllows = Array.from(allowSelect.selectedOptions).map(o => o.value);
  admin.html:2436:                allowSelect.innerHTML = '<option value="">-- Ninguno --</option>';
  admin.html:2437:                const sellers = storeConfig.sellers || [];
  admin.html:2438:                sellers.forEach(s => {
  admin.html:2439:                    const opt = document.createElement('option');
  admin.html:2440:                    opt.value = s.name;
  admin.html:2441:                    opt.text = "👔 " + s.name;
  admin.html:2442:                    if (currentAllows.includes(s.name)) {
  admin.html:2443:                        opt.selected = true;
  admin.html:2444:                    }
  admin.html:2445:                    allowSelect.appendChild(opt);
  admin.html:2446:                });
  admin.html:2447:                if (window.allClientProfiles) {
  admin.html:2448:                    Object.keys(window.allClientProfiles).forEach(phone => {
  admin.html:2449:                        const name = window.allClientProfiles[phone].name || phone;
  admin.html:2450:                        const opt = document.createElement('option');
  admin.html:2451:                        opt.value = phone;
  admin.html:2452:                        opt.text = "👥 " + name + " (" + phone + ")";
  admin.html:2453:                        if (currentAllows.includes(phone)) {
  admin.html:2454:                            opt.selected = true;
  admin.html:2455:                        }
  admin.html:2456:                        allowSelect.appendChild(opt);
  admin.html:2457:                    });
  admin.html:2458:                }
  admin.html:2459:            }
  admin.html:2460:        }
  admin.html:2461:        
  admin.html:2462:        function filterAllowExhausted() {
  admin.html:2463:            const term = document.getElementById('search-allow-exhausted').value.toLowerCase();
  admin.html:2464:            const sel = document.getElementById('new-allow-exhausted-seller');
  admin.html:2465:            if (sel) {
  admin.html:2466:                Array.from(sel.options).forEach(opt => {
  admin.html:2467:                    if (opt.value === '') return;
  admin.html:2468:                    opt.style.display = opt.text.toLowerCase().includes(term) ? 'block' : 'none';
  admin.html:2469:                });
  admin.html:2470:            }
  admin.html:2471:        }
  admin.html:2472:
  admin.html:2473:        // Detecta cambio en categoria para mostrar owner
  admin.html:2474:        document.getElementById('new-category').addEventListener('change', function () {
  admin.html:2475:            document.getElementById('owner-col').style.display = this.value === 'ventas_extras' ? 
'block' : 'none';
  admin.html:2476:        });
  admin.html:2477:
  admin.html:2478:        function renderAdminList() {
  admin.html:2479:            if (window.renderManualClientProducts) window.renderManualClientProducts();
  admin.html:2480:            populateOwnerSelect();
  admin.html:2481:            const listDiv = document.getElementById('admin-list');
  admin.html:2482:            const search = document.getElementById('search-prod').value.toLowerCase();
  admin.html:2483:            const filterCat = document.getElementById('filter-cat').value;
  admin.html:2484:
  admin.html:2485:            listDiv.innerHTML = '';
  admin.html:2486:
  admin.html:2487:            dynamicProducts.forEach((p, index) => {
  admin.html:2488:                if (!p) return;
  admin.html:2489:                // Filtros
  admin.html:2490:                if (filterCat !== 'all' && p.category !== filterCat) return;
  admin.html:2491:                if (search && !p.name.toLowerCase().includes(search)) return;
  admin.html:2492:
  admin.html:2493:                const isActive = p.active !== false; // Si no tiene, default es true
  admin.html:2494:                const inStock = p.inStock !== false;
  admin.html:2495:
  admin.html:2496:                const div = document.createElement('div');
  admin.html:2497:                div.className = `admin-item ${!isActive ? 'inactive' : ''}`;
  admin.html:2498:
  admin.html:2499:                div.innerHTML = `
  admin.html:2500:                    <div style="cursor: move; opacity: 0.5" title="Mover (Manten presionado)" 
draggable="true" ondragstart="dragStart(${index})" ondragover="dragOver(event)" ondrop="drop(${index})">
  admin.html:2501:                        <i class="fa-solid fa-grip-vertical"></i>
  admin.html:2502:                    </div>
  admin.html:2503:                    <div>
  admin.html:2504:                        <strong style="color: ${isActive ? 'white' : '#a0a0a0'}">${p.name}</strong> 
  admin.html:2505:                        <br>
  admin.html:2506:                        <span style="font-size: 0.8rem; color: 
var(--text-primary)">$${p.price.toLocaleString()}</span> - 
  admin.html:2507:                        <span style="font-size: 0.8rem; color: #ccc;">${p.category} | 
${p.brand}</span>
  admin.html:2508:                        ${p.stock > 0 ? `<br><span style="color:#f39c12; font-size: 0.75rem; 
font-weight: bold;">[Stock: ${p.stock}]</span>` : ''}
  admin.html:2509:                        ${!inStock ? '<br><span style="color:#ff4d4d; font-size: 0.75rem; 
font-weight: bold;">[AGOTADO]</span>' : ''}
  admin.html:2510:                    </div>
  admin.html:2511:                    <div class="item-actions">
  admin.html:2512:                        <button class="btn-icon btn-toggle" onclick="toggleActive(${index})" 
title="${isActive ? 'Pausar/Ocultar' : 'Activar/Mostrar'}">
  admin.html:2513:                            <i class="fa-solid ${isActive ? 'fa-eye' : 'fa-eye-slash'}"></i>
  admin.html:2514:                        </button>
  admin.html:2515:                        <button class="btn-icon btn-toggle" style="color: ${inStock ? '#4cd137' : 
'#ff4d4d'}" onclick="toggleStock(${index})" title="${inStock ? 'Marcar Agotado' : 'Marcar Disponible'}">
  admin.html:2516:                            <i class="fa-solid ${inStock ? 'fa-box-open' : 'fa-box'}"></i>
  admin.html:2517:                        </button>
  admin.html:2518:                        <button class="btn-icon btn-edit" onclick="editProduct(${index})" 
title="Editar">
  admin.html:2519:                            <i class="fa-solid fa-pen"></i>
  admin.html:2520:                        </button>
  admin.html:2521:                        <button class="btn-icon btn-delete" onclick="deleteProduct(${index})" 
title="Eliminar">
  admin.html:2522:                            <i class="fa-solid fa-trash"></i>
  admin.html:2523:                        </button>
  admin.html:2524:                    </div>
  admin.html:2525:                `;
  admin.html:2526:                listDiv.appendChild(div);
  admin.html:2527:            });
  admin.html:2528:        }
  admin.html:2529:
  admin.html:2530:        // Drag and Drop ordering
  admin.html:2531:        let dragSrcIndex = null;
  admin.html:2532:        function dragStart(index) {
  admin.html:2533:            dragSrcIndex = index;
  admin.html:2534:        }
  admin.html:2535:        function dragOver(e) {
  admin.html:2536:            e.preventDefault();
  admin.html:2537:        }
  admin.html:2538:        function drop(dropIndex) {
  admin.html:2539:            if (dragSrcIndex === null || dragSrcIndex === dropIndex) return;
  admin.html:2540:            // Swap array pos
  admin.html:2541:            const item = dynamicProducts.splice(dragSrcIndex, 1)[0];
  admin.html:2542:            dynamicProducts.splice(dropIndex, 0, item);
  admin.html:2543:            saveProductsToStorage();
  admin.html:2544:            renderAdminList();
  admin.html:2545:        }
  admin.html:2546:
  admin.html:2547:        function toggleActive(index) {
  admin.html:2548:            if (dynamicProducts[index].active === undefined) {
  admin.html:2549:                dynamicProducts[index].active = false;
  admin.html:2550:            } else {
  admin.html:2551:                dynamicProducts[index].active = !dynamicProducts[index].active;
  admin.html:2552:            }
  admin.html:2553:            saveProductsToStorage();
  admin.html:2554:            renderAdminList();
  admin.html:2555:        }
  admin.html:2556:
  admin.html:2557:        function toggleStock(index) {
  admin.html:2558:            if (dynamicProducts[index].inStock === undefined) {
  admin.html:2559:                dynamicProducts[index].inStock = false;
  admin.html:2560:            } else {
  admin.html:2561:                dynamicProducts[index].inStock = !dynamicProducts[index].inStock;
  admin.html:2562:            }
  admin.html:2563:            saveProductsToStorage();
  admin.html:2564:            renderAdminList();
  admin.html:2565:        }
  admin.html:2566:
  admin.html:2567:        function editProduct(index) {
  admin.html:2568:            editIndex = index;
  admin.html:2569:            const p = dynamicProducts[index];
  admin.html:2570:            document.getElementById('new-name').value = p.name;
  admin.html:2571:            document.getElementById('new-price').value = p.price;
  admin.html:2572:            document.getElementById('new-seller-price').value = p.sellerPrice || p.price;
  admin.html:2573:            document.getElementById('new-purchase-price').value = p.purchasePrice || 0;
  admin.html:2574:            document.getElementById('new-category').value = p.category;
  admin.html:2575:            populateOwnerSelect();
  admin.html:2576:            document.getElementById('new-owner').value = p.owner || 'admin';
  admin.html:2577:            document.getElementById('owner-col').style.display = p.category === 'ventas_extras' ? 
'block' : 'none';
  admin.html:2578:            document.getElementById('new-brand').value = p.brand;
  admin.html:2579:            document.getElementById('new-image').value = p.image || '';
  admin.html:2580:            document.getElementById('new-desc').value = p.desc || '';
  admin.html:2581:            document.getElementById('new-stock').value = p.stock || 0;
  admin.html:2582:            if (document.getElementById('new-allow-exhausted-seller')) {
  admin.html:2583:                const sel = document.getElementById('new-allow-exhausted-seller');
  admin.html:2584:                document.getElementById('search-allow-exhausted').value = '';
  admin.html:2585:                Array.from(sel.options).forEach(opt => opt.style.display = 'block'); // reset
  admin.html:2586:
  admin.html:2587:                const allows = Object.keys(p.reserveRules || {});
  admin.html:2588:                if (allows.length === 0 && p.allowExhaustedSeller) { // fallback
  admin.html:2589:                    p.allowExhaustedSeller.split(',').map(x=>x.trim()).forEach(a=> {
  admin.html:2590:                       if (a) allows.push(a); 
  admin.html:2591:                    });
  admin.html:2592:                }
  admin.html:2593:                
  admin.html:2594:                Array.from(sel.options).forEach(opt => opt.selected = allows.includes(opt.value));
  admin.html:2595:                
  admin.html:2596:                let defaultStock = '';
  admin.html:2597:                let defaultDate = '';
  admin.html:2598:                if (allows.length > 0 && p.reserveRules && p.reserveRules[allows[0]]) {
  admin.html:2599:                   defaultStock = p.reserveRules[allows[0]].stock !== undefined && 
p.reserveRules[allows[0]].stock !== null ? p.reserveRules[allows[0]].stock : '';
  admin.html:2600:                   defaultDate = p.reserveRules[allows[0]].date || '';
  admin.html:2601:                }
  admin.html:2602:                document.getElementById('new-allow-exhausted-stock').value = defaultStock;
  admin.html:2603:                document.getElementById('new-allow-exhausted-date').value = defaultDate;
  admin.html:2604:            }
  admin.html:2605:
  admin.html:2606:            document.getElementById('form-title').innerText = "Editar Producto";
  admin.html:2607:            document.querySelector('.save-btn').innerText = "Actualizar Producto";
  admin.html:2608:            document.getElementById('btn-cancel').style.display = "block";
  admin.html:2609:
  admin.html:2610:            window.scrollTo({ top: 0, behavior: 'smooth' });
  admin.html:2611:        }
  admin.html:2612:
  admin.html:2613:        function cancelEdit() {
  admin.html:2614:            editIndex = -1;
  admin.html:2615:            document.getElementById('new-name').value = '';
  admin.html:2616:            document.getElementById('new-price').value = '';
  admin.html:2617:            document.getElementById('new-seller-price').value = '';
  admin.html:2618:            document.getElementById('new-purchase-price').value = '';
  admin.html:2619:            document.getElementById('new-brand').value = '';
  admin.html:2620:            document.getElementById('new-image').value = '';
  admin.html:2621:            document.getElementById('new-desc').value = '';
  admin.html:2622:            document.getElementById('new-stock').value = '0';
  admin.html:2623:            if (document.getElementById('new-allow-exhausted-seller')) {
  admin.html:2624:                const sel = document.getElementById('new-allow-exhausted-seller');
  admin.html:2625:                Array.from(sel.options).forEach(opt => opt.selected = false);
  admin.html:2626:                document.getElementById('new-allow-exhausted-stock').value = '';
  admin.html:2627:                document.getElementById('new-allow-exhausted-date').value = '';
  admin.html:2628:                document.getElementById('search-allow-exhausted').value = '';
  admin.html:2629:            }
  admin.html:2630:            document.getElementById('owner-col').style.display = 'none';
  admin.html:2631:            document.getElementById('new-owner').value = 'admin';
  admin.html:2632:
  admin.html:2633:            document.getElementById('form-title').innerText = "Agregar Nuevo Producto";
  admin.html:2634:            document.querySelector('.save-btn').innerText = "Guardar Producto";
  admin.html:2635:            document.getElementById('btn-cancel').style.display = "none";
  admin.html:2636:        }
  admin.html:2637:
  admin.html:2638:        function saveProduct() {
  admin.html:2639:            const name = document.getElementById('new-name').value;
  admin.html:2640:            const price = parseInt(document.getElementById('new-price').value);
  admin.html:2641:            const sellerPrice = parseInt(document.getElementById('new-seller-price').value) || price;
  admin.html:2642:            const purchasePrice = parseInt(document.getElementById('new-purchase-price').value) || 0;
  admin.html:2643:            const category = document.getElementById('new-category').value;
  admin.html:2644:            const owner = category === 'ventas_extras' ? document.getElementById('new-owner').value 
: null;
  admin.html:2645:            const brand = document.getElementById('new-brand').value;
  admin.html:2646:            const desc = document.getElementById('new-desc').value.trim();
  admin.html:2647:            const stock = parseInt(document.getElementById('new-stock').value) || 0;
  admin.html:2648:            const allowExhaustedSeller = document.getElementById('new-allow-exhausted-seller') ? 
Array.from(document.getElementById('new-allow-exhausted-seller').selectedOptions).map(o => o.value).filter(v => v !== 
'').join(',') : '';
  admin.html:2649:            
  admin.html:2650:            let reserveRules = {};
  admin.html:2651:            const stockValStr = document.getElementById('new-allow-exhausted-stock').value;
  admin.html:2652:            const dateValStr = document.getElementById('new-allow-exhausted-date').value;
  admin.html:2653:            const reqStock = stockValStr ? parseInt(stockValStr) : null;
  admin.html:2654:            
  admin.html:2655:            if (document.getElementById('new-allow-exhausted-seller')) {
  admin.html:2656:                const selNodes = 
Array.from(document.getElementById('new-allow-exhausted-seller').selectedOptions).map(o => o.value).filter(v => v !== 
'');
  admin.html:2657:                selNodes.forEach(user => {
  admin.html:2658:                    reserveRules[user] = {
  admin.html:2659:                        stock: reqStock,
  admin.html:2660:                        date: dateValStr
  admin.html:2661:                    };
  admin.html:2662:                });
  admin.html:2663:            }
  admin.html:2664:
  admin.html:2665:            let image = document.getElementById('new-image').value;
  admin.html:2666:
  admin.html:2667:            if (!name || isNaN(price)) return alert('Completa los campos de Nombre y Precio');
  admin.html:2668:
  admin.html:2669:            if (category === 'ventas_extras' && owner !== 'admin') {
  admin.html:2670:                const s = (storeConfig.sellers || []).find(sel => sel.name === owner);
  admin.html:2671:                if (s) {
  admin.html:2672:                    const limit = s.extraProductsLimit || 0;
  admin.html:2673:                    const currentlyInSystem = dynamicProducts.filter(dp => dp.category === 
'ventas_extras' && dp.owner === owner && (editIndex === -1 || dp.id !== dynamicProducts[editIndex].id)).length;
  admin.html:2674:                    if (limit > 0 && currentlyInSystem >= limit) {
  admin.html:2675:                        return alert('Atención: Este vendedor ha alcanzado su límite de ' + limit + 
' productos extras permitidos según su plan.');
  admin.html:2676:                    }
  admin.html:2677:                }
  admin.html:2678:            }
  admin.html:2679:
  admin.html:2680:            // Set default image dynamically if empty
  admin.html:2681:            if (!image) {
  admin.html:2682:                if (brand.toLowerCase() === 'netflix') image = 'assets/netflix.png';
  admin.html:2683:                else if (brand.toLowerCase().includes('prime')) image = 'assets/prime.png';
  admin.html:2684:                else if (brand.toLowerCase().includes('disney')) image = 'assets/disney.svg';
  admin.html:2685:                else if (brand.toLowerCase().includes('max')) image = 'assets/max.svg';
  admin.html:2686:                else if (brand.toLowerCase().includes('paramount')) image = 'assets/paramount.svg';
  admin.html:2687:                else if (brand.toLowerCase().includes('iptv')) image = 'assets/iptv.png';
  admin.html:2688:                else if (brand.toLowerCase().includes('vix')) image = 'assets/vix.png';
  admin.html:2689:                else if (brand.toLowerCase().includes('crunchyroll')) image = 
'assets/crunchyroll.png';
  admin.html:2690:                else if (brand.toLowerCase().includes('apple')) image = 'assets/appletv.png';
  admin.html:2691:                else if (brand.toLowerCase().includes('combo')) image = 'assets/logo_combo.jpg';
  admin.html:2692:            }
  admin.html:2693:
  admin.html:2694:            if (editIndex === -1) {
  admin.html:2695:                const newProduct = {
  admin.html:2696:                    id: Date.now(),
  admin.html:2697:                    name,
  admin.html:2698:                    price,
  admin.html:2699:                    sellerPrice,
  admin.html:2700:                    purchasePrice,
  admin.html:2701:                    category,
  admin.html:2702:                    owner,
  admin.html:2703:                    brand,
  admin.html:2704:                    desc,
  admin.html:2705:                    stock,
  admin.html:2706:                    allowExhaustedSeller,
  admin.html:2707:                    reserveRules,
  admin.html:2708:                    image,
  admin.html:2709:                    active: true
  admin.html:2710:                };
  admin.html:2711:                dynamicProducts.unshift(newProduct);
  admin.html:2712:            } else {
  admin.html:2713:                dynamicProducts[editIndex].name = name;
  admin.html:2714:                dynamicProducts[editIndex].price = price;
  admin.html:2715:                dynamicProducts[editIndex].sellerPrice = sellerPrice;
  admin.html:2716:                dynamicProducts[editIndex].category = category;
  admin.html:2717:                dynamicProducts[editIndex].owner = owner || null;
  admin.html:2718:                dynamicProducts[editIndex].brand = brand;
  admin.html:2719:                dynamicProducts[editIndex].desc = desc;
  admin.html:2720:                dynamicProducts[editIndex].stock = stock;
  admin.html:2721:                dynamicProducts[editIndex].allowExhaustedSeller = allowExhaustedSeller;
  admin.html:2722:                dynamicProducts[editIndex].reserveRules = reserveRules;
  admin.html:2723:                dynamicProducts[editIndex].purchasePrice = purchasePrice;
  admin.html:2724:                dynamicProducts[editIndex].image = image;
  admin.html:2725:                // doesn't touch active status
  admin.html:2726:                cancelEdit();
  admin.html:2727:            }
  admin.html:2728:
  admin.html:2729:            saveProductsToStorage();
  admin.html:2730:            renderAdminList();
  admin.html:2731:            alert(editIndex === -1 ? 'Producto Guardado!' : 'Producto Actualizado!');
  admin.html:2732:            if (editIndex === -1) cancelEdit(); // clear forms
  admin.html:2733:        }
  admin.html:2734:
  admin.html:2735:        // --- SECTION CRM MESSAGING ---
  admin.html:2736:        window.addCRMPlatform = function(platformName = '', dataItems = []) {
  admin.html:2737:            const container = document.getElementById('crm-platforms-container');
  admin.html:2738:            if (!container) return;
  admin.html:2739:
  admin.html:2740:            const platformId = 'platform-' + Date.now() + Math.floor(Math.random()*1000);
  admin.html:2741:            const div = document.createElement('div');
  admin.html:2742:            div.className = 'crm-platform-section';
  admin.html:2743:            div.dataset.platformId = platformId;
  admin.html:2744:            div.style = 'background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); 
padding: 1rem; border-radius: 12px;';
  admin.html:2745:            div.innerHTML = `
  admin.html:2746:                <div style="display:flex; gap:1rem; align-items:center; margin-bottom:0.5rem; 
border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.8rem;">
  admin.html:2747:                    <div style="background:var(--accent-primary); color:black; width:32px; 
height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center;">
  admin.html:2748:                        <i class="fa-solid fa-tv"></i>
  admin.html:2749:                    </div>
  admin.html:2750:                    <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
  admin.html:2751:                        <input type="text" class="platform-name-input" placeholder="Netflix, 
Disney..." style="width:100%; font-weight:bold; font-size:1.1rem; border:none; background:transparent; color:white;" 
value="${platformName}">
  admin.html:2752:                        <input type="text" class="platform-variant-input" placeholder="Variante (Ej: 
TV, Cel o Pc, Privada TV...)" style="width:100%; font-size:0.8rem; border:none; background:transparent; color:#2ab7ca; 
border-bottom:1px dashed rgba(42,183,202,0.3);" value="${dataItems.variant || ''}">
  admin.html:2753:                    </div>
  admin.html:2754:                    <button class="btn-icon" style="color:#ff4d4d; border:1px solid 
rgba(255,77,77,0.3); padding:6px; border-radius:6px;" onclick="this.parentElement.parentElement.remove()" 
title="Eliminar Pantalla Completa">
  admin.html:2755:                        <i class="fa-solid fa-trash-can"></i>
  admin.html:2756:                    </button>
  admin.html:2757:                </div>
  admin.html:2758:                <div style="margin-bottom:1rem; background:rgba(42, 183, 202, 0.1); padding:8px; 
border-radius:8px; border:1px solid rgba(42, 183, 202, 0.3);">
  admin.html:2759:                    <label style="font-size:0.75rem; color:#2ab7ca; display:block; 
margin-bottom:4px; font-weight:bold;">URL DE LA GUÍA (BOTÓN PARA EL CLIENTE):</label>
  admin.html:2760:                    <input type="text" class="platform-guide-url" 
placeholder="https://ejemplo.com/guia-netflix" style="width:100%; font-size:0.85rem; border-radius:6px; padding:6px; 
border:1px solid rgba(42,183,202,0.2);" value="${dataItems.guideUrl || ''}">
  admin.html:2761:                </div>
  admin.html:2762:                <div class="platform-photos-list" style="display:flex; flex-direction:column; 
gap:0.6rem; margin-bottom:0.8rem;"></div>
  admin.html:2763:                <button class="save-btn" style="background:rgba(255,255,255,0.1); border:1px dashed 
rgba(255,255,255,0.3); font-size:0.85rem; padding:8px 12px; width:auto; text-align:left;" 
onclick="addPhotoTextToPlatform('${platformId}')">
  admin.html:2764:                    <i class="fa-solid fa-plus"></i> Añadir Foto/Texto a esta Pantalla
  admin.html:2765:                </button>
  admin.html:2766:            `;
  admin.html:2767:            container.appendChild(div);
  admin.html:2768:
  admin.html:2769:            const photosList = div.querySelector('.platform-photos-list');
  admin.html:2770:            dataItems.forEach(item => addPhotoTextToPlatform(platformId, item));
  admin.html:2771:        }
  admin.html:2772:
  admin.html:2773:        window.addPhotoTextToPlatform = function(platformId, data = { photo: '', text: '' }) {
  admin.html:2774:            const platformDiv = document.querySelector(`[data-platform-id="${platformId}"]`);
  admin.html:2775:            if (!platformDiv) return;
  admin.html:2776:            const photosList = platformDiv.querySelector('.platform-photos-list');
  admin.html:2777:            
  admin.html:2778:            const div = document.createElement('div');
  admin.html:2779:            div.className = 'gallery-item';
  admin.html:2780:            div.style = 'border: 1px solid rgba(255,255,255,0.08); padding: 0.8rem; border-radius: 
8px; display: flex; flex-direction: column; gap: 0.6rem; background: rgba(0,0,0,0.2);';
  admin.html:2781:            div.innerHTML = `
  admin.html:2782:                <div style="display:flex; gap:0.5rem; align-items:center;">
  admin.html:2783:                    <i class="fa-solid fa-image" style="color:rgba(255,255,255,0.4); 
font-size:0.8rem;"></i>
  admin.html:2784:                    <input type="text" class="gallery-photo" placeholder="URL de la Foto" 
style="flex:1; border-radius:6px; font-size:0.85rem;" value="${data.photo}">
  admin.html:2785:                    <button class="btn-icon" style="color:#ff4d4d; padding:4px;" 
onclick="this.parentElement.parentElement.remove()">
  admin.html:2786:                        <i class="fa-solid fa-xmark"></i>
  admin.html:2787:                    </button>
  admin.html:2788:                </div>
  admin.html:2789:                <textarea class="gallery-text" rows="2" placeholder="Texto o Copy..." 
style="width:100%; border-radius:6px; padding:6px; font-size:0.85rem;">${data.text}</textarea>
  admin.html:2790:            `;
  admin.html:2791:            photosList.appendChild(div);
  admin.html:2792:        }
  admin.html:2793:
  admin.html:2794:        function renderMsgPhotoGallery() {
  admin.html:2795:            const container = document.getElementById('crm-platforms-container');
  admin.html:2796:            if (!container) return;
  admin.html:2797:            container.innerHTML = '';
  admin.html:2798:            
  admin.html:2799:            const platforms = storeConfig.crmPlatforms || {};
  admin.html:2800:            const pKeys = Object.keys(platforms);
  admin.html:2801:            const dict = storeConfig.crmGalleryDict || {};
  admin.html:2802:
  admin.html:2803:            if (pKeys.length > 0) {
  admin.html:2804:                // Nuevo formato por plataformas
  admin.html:2805:                for (let platformFullName of pKeys) {
  admin.html:2806:                    const dataItems = dict[platformFullName] || [];
  admin.html:2807:                    const pConfig = platforms[platformFullName];
  admin.html:2808:                    const guideUrl = pConfig ? pConfig.manualUrl : '';
  admin.html:2809:                    
  admin.html:2810:                    // Separar nombre y variante si existe el separador " | "
  admin.html:2811:                    let pName = platformFullName;
  admin.html:2812:                    let pVariant = '';
  admin.html:2813:                    if (platformFullName.includes(' | ')) {
  admin.html:2814:                        const parts = platformFullName.split(' | ');
  admin.html:2815:                        pName = parts[0];
  admin.html:2816:                        pVariant = parts[1];
  admin.html:2817:                    }
  admin.html:2818:
  admin.html:2819:                    dataItems.guideUrl = guideUrl; 
  admin.html:2820:                    dataItems.variant = pVariant;
  admin.html:2821:                    addCRMPlatform(pName, dataItems);
  admin.html:2822:                }
  admin.html:2823:            } else if (Object.keys(dict).length > 0) {
  admin.html:2824:                for (let platformFullName in dict) {
  admin.html:2825:                    const dataItems = dict[platformFullName] || [];
  admin.html:2826:                    let pName = platformFullName;
  admin.html:2827:                    let pVariant = '';
  admin.html:2828:                    if (platformFullName.includes(' | ')) {
  admin.html:2829:                        const parts = platformFullName.split(' | ');
  admin.html:2830:                        pName = parts[0];
  admin.html:2831:                        pVariant = parts[1];
  admin.html:2832:                    }
  admin.html:2833:                    dataItems.variant = pVariant;
  admin.html:2834:                    addCRMPlatform(pName, dataItems);
  admin.html:2835:                }
  admin.html:2836:            } else if (Array.isArray(storeConfig.crmGallery) && storeConfig.crmGallery.length > 0) {
  admin.html:2837:                // Formato antiguo (compatibilidad)
  admin.html:2838:                addCRMPlatform('General', storeConfig.crmGallery);
  admin.html:2839:            }
  admin.html:2840:            
  admin.html:2841:            // Si está vacío, añadir uno de sugerencia para que el usuario pueda empezar
  admin.html:2842:            if (container.children.length === 0) {
  admin.html:2843:                addCRMPlatform('Netflix', []);
  admin.html:2844:            }
  admin.html:2845:        }
  admin.html:2846:
  admin.html:2847:        window.filterCRMAdminPlatforms = function(val) {
  admin.html:2848:            const filter = val.toLowerCase();
  admin.html:2849:            const sections = document.querySelectorAll('.crm-platform-section');
  admin.html:2850:            sections.forEach(sec => {
  admin.html:2851:                const input = sec.querySelector('.platform-name-input');
  admin.html:2852:                const name = input ? input.value.toLowerCase() : '';
  admin.html:2853:                if (name.includes(filter)) {
  admin.html:2854:                    sec.style.display = 'block';
  admin.html:2855:                } else {
  admin.html:2856:                    sec.style.display = 'none';
  admin.html:2857:                }
  admin.html:2858:            });
  admin.html:2859:        }
  admin.html:2860:
  admin.html:2861:        function deleteProduct(index) {
  admin.html:2862:            if (confirm(`¿Estás seguro de que quieres eliminar "${dynamicProducts[index].name}"?`)) {
  admin.html:2863:                dynamicProducts.splice(index, 1);
  admin.html:2864:                saveProductsToStorage();
  admin.html:2865:                renderAdminList();
  admin.html:2866:            }
  admin.html:2867:        }
  admin.html:2868:
  admin.html:2869:        function saveProductsToStorage() {
  admin.html:2870:            db.ref('products').set(dynamicProducts);
  admin.html:2871:        }
  admin.html:2872:
  admin.html:2873:        function saveConfig() {
  admin.html:2874:            if (document.getElementById('conf-maintenanceEnabled')) {
  admin.html:2875:                storeConfig.maintenanceEnabled = 
document.getElementById('conf-maintenanceEnabled').value === 'true';
  admin.html:2876:                storeConfig.maintenanceMessage = 
document.getElementById('conf-maintenanceMessage').value;
  admin.html:2877:            }
  admin.html:2878:
  admin.html:2879:            storeConfig.whatsappNumber = document.getElementById('conf-whatsapp').value;
  admin.html:2880:            if (document.getElementById('conf-facebook')) storeConfig.facebookUrl = 
document.getElementById('conf-facebook').value.trim();
  admin.html:2881:            if (document.getElementById('conf-instagram')) storeConfig.instagramUrl = 
document.getElementById('conf-instagram').value.trim();
  admin.html:2882:            if (document.getElementById('conf-tiktok')) storeConfig.tiktokUrl = 
document.getElementById('conf-tiktok').value.trim();
  admin.html:2883:            if (document.getElementById('conf-kwai')) storeConfig.kwaiUrl = 
document.getElementById('conf-kwai').value.trim();
  admin.html:2884:            if (document.getElementById('conf-youtube')) storeConfig.youtubeUrl = 
document.getElementById('conf-youtube').value.trim();
  admin.html:2885:
  admin.html:2886:            storeConfig.paymentInfo = document.getElementById('conf-paymentInfo').value;
  admin.html:2887:            storeConfig.discountEnabled = document.getElementById('conf-discountEnabled').value === 
'true';
  admin.html:2888:            storeConfig.discountAmount = 
parseInt(document.getElementById('conf-discountAmount').value) || 0;
  admin.html:2889:
  admin.html:2890:            storeConfig.sellerDiscountEnabled = 
document.getElementById('conf-sellerDiscountEnabled').value === 'true';
  admin.html:2891:            storeConfig.sellerDiscountAmount = 
parseInt(document.getElementById('conf-sellerDiscountAmount').value) || 0;
  admin.html:2892:
  admin.html:2893:            storeConfig.clientBannerEnabled = 
document.getElementById('conf-clientBannerEnabled').value === 'true';
  admin.html:2894:            storeConfig.clientBannerText = document.getElementById('conf-clientBannerText').value;
  admin.html:2895:            storeConfig.sellerBannerEnabled = 
document.getElementById('conf-sellerBannerEnabled').value === 'true';
  admin.html:2896:            storeConfig.sellerBannerText = document.getElementById('conf-sellerBannerText').value;
  admin.html:2897:
  admin.html:2898:            storeConfig.clientPromoDiscount = 
parseInt(document.getElementById('conf-clientPromoDiscount').value) || 0;
  admin.html:2899:            storeConfig.clientPromoLimit = 
parseInt(document.getElementById('conf-clientPromoLimit').value) || 0;
  admin.html:2900:            storeConfig.sellerPromoDiscount = 
parseInt(document.getElementById('conf-sellerPromoDiscount').value) || 0;
  admin.html:2901:            storeConfig.sellerPromoLimit = 
parseInt(document.getElementById('conf-sellerPromoLimit').value) || 0;
  admin.html:2902:
  admin.html:2903:            storeConfig.netflixEnabled = document.getElementById('conf-netflixEnabled').value === 
'true';
  admin.html:2904:            storeConfig.disneyEnabled = document.getElementById('conf-disneyEnabled').value === 
'true';
  admin.html:2905:
  admin.html:2906:            if (document.getElementById('conf-reminderTemplate')) {
  admin.html:2907:                storeConfig.reminderTemplate = 
document.getElementById('conf-reminderTemplate').value;
  admin.html:2908:            }
  admin.html:2909:            if (document.getElementById('conf-reminderTomorrowTemplate')) {
  admin.html:2910:                storeConfig.reminderTomorrowTemplate = 
document.getElementById('conf-reminderTomorrowTemplate').value;
  admin.html:2911:            }
  admin.html:2912:            if (document.getElementById('conf-sellerReminderTemplate')) {
  admin.html:2913:                storeConfig.sellerReminderTemplate = 
document.getElementById('conf-sellerReminderTemplate').value;
  admin.html:2914:            }
  admin.html:2915:            if (document.getElementById('conf-sellerReminderTomorrowTemplate')) {
  admin.html:2916:                storeConfig.sellerReminderTomorrowTemplate = 
document.getElementById('conf-sellerReminderTomorrowTemplate').value;
  admin.html:2917:            }
  admin.html:2918:            if (document.getElementById('conf-renovadaSingularTemplate')) {
  admin.html:2919:                storeConfig.renovadaSingularTemplate = 
document.getElementById('conf-renovadaSingularTemplate').value;
  admin.html:2920:            }
  admin.html:2921:            if (document.getElementById('conf-renovadaPluralTemplate')) {
  admin.html:2922:                storeConfig.renovadaPluralTemplate = 
document.getElementById('conf-renovadaPluralTemplate').value;
  admin.html:2923:            }
  admin.html:2924:
  admin.html:2925:            storeConfig.autoReminderEnabled = 
document.getElementById('conf-autoReminderEnabled').value === "true";
  admin.html:2926:            if (document.getElementById('conf-autoReminderTomorrowEnabled')) 
storeConfig.autoReminderTomorrowEnabled = document.getElementById('conf-autoReminderTomorrowEnabled').value === "true";
  admin.html:2927:            storeConfig.autoReminderHour = 
parseInt(document.getElementById('conf-autoReminderHour').value) || 0;
  admin.html:2928:
  admin.html:2929:            if (document.getElementById('conf-mainBannerEnabled')) storeConfig.mainBannerEnabled = 
document.getElementById('conf-mainBannerEnabled').value === 'true';
  admin.html:2930:
  admin.html:2931:            storeConfig.sellerPassword = document.getElementById('conf-sellerPassword').value;
  admin.html:2932:            storeConfig.adminPassword = document.getElementById('conf-adminPassword').value || 
'admin123';
  admin.html:2933:
  admin.html:2934:            if (document.getElementById('conf-incentiveEnabled')) storeConfig.incentiveEnabled = 
document.getElementById('conf-incentiveEnabled').value === 'true';
  admin.html:2935:            if (document.getElementById('conf-incentiveMessage')) storeConfig.incentiveMessage = 
document.getElementById('conf-incentiveMessage').value;
  admin.html:2936:            if (document.getElementById('conf-incentiveNetflix')) {
  admin.html:2937:                storeConfig.incentiveNetflix = 
parseInt(document.getElementById('conf-incentiveNetflix').value) || 0;
  admin.html:2938:                storeConfig.incentiveNetflixPrivada = 
parseInt(document.getElementById('conf-incentiveNetflixPrivada').value) || 0;
  admin.html:2939:                storeConfig.incentiveDisney = 
parseInt(document.getElementById('conf-incentiveDisney').value) || 0;
  admin.html:2940:                storeConfig.incentiveHbo = 
parseInt(document.getElementById('conf-incentiveHbo').value) || 0;
  admin.html:2941:                storeConfig.incentiveMax = storeConfig.incentiveHbo;
  admin.html:2942:                storeConfig.incentivePrime = 
parseInt(document.getElementById('conf-incentivePrime').value) || 0;
  admin.html:2943:                storeConfig.incentiveParamount = 
parseInt(document.getElementById('conf-incentiveParamount').value) || 0;
  admin.html:2944:                storeConfig.incentiveVix = 
parseInt(document.getElementById('conf-incentiveVix').value) || 0;
  admin.html:2945:                storeConfig.incentiveIptv = 
parseInt(document.getElementById('conf-incentiveIptv').value) || 0;
  admin.html:2946:                storeConfig.incentiveCrunchyroll = 
parseInt(document.getElementById('conf-incentiveCrunchyroll').value) || 0;
  admin.html:2947:                storeConfig.incentiveApple = 
parseInt(document.getElementById('conf-incentiveApple').value) || 0;
  admin.html:2948:                storeConfig.incentiveCombo2 = 
parseInt(document.getElementById('conf-incentiveCombo2').value) || 0;
  admin.html:2949:                storeConfig.incentiveCombo3 = 
parseInt(document.getElementById('conf-incentiveCombo3').value) || 0;
  admin.html:2950:                storeConfig.incentiveCombo4 = 
parseInt(document.getElementById('conf-incentiveCombo4').value) || 0;
  admin.html:2951:                storeConfig.incentiveCombo5 = 
parseInt(document.getElementById('conf-incentiveCombo5').value) || 0;
  admin.html:2952:                storeConfig.incentiveFinde = 
parseInt(document.getElementById('conf-incentiveFinde').value) || 0;
  admin.html:2953:                storeConfig.incentiveMes = 
parseInt(document.getElementById('conf-incentiveMes').value) || 0;
  admin.html:2954:            }
  admin.html:2955:
  admin.html:2956:            if (document.getElementById('conf-tabOrder')) {
  admin.html:2957:                const arr = document.getElementById('conf-tabOrder').value.split(',').map(s => 
s.trim()).filter(s => s);
  admin.html:2958:                storeConfig.tabOrder = arr.length > 0 ? arr : null;
  admin.html:2959:            }
  admin.html:2960:            if (document.getElementById('conf-nequiEnabled')) {
  admin.html:2961:                storeConfig.nequiEnabled = document.getElementById('conf-nequiEnabled').value === 
'true';
  admin.html:2962:                storeConfig.nequiLabel = document.getElementById('conf-nequiLabel').value.trim();
  admin.html:2963:                storeConfig.nequiImg = document.getElementById('conf-nequiImg').value.trim();
  admin.html:2964:
  admin.html:2965:                storeConfig.nuEnabled = document.getElementById('conf-nuEnabled').value === 'true';
  admin.html:2966:                storeConfig.nuLabel = document.getElementById('conf-nuLabel').value.trim();
  admin.html:2967:                storeConfig.nuImg = document.getElementById('conf-nuImg').value.trim();
  admin.html:2968:            }
  admin.html:2969:
  admin.html:2970:            // Save CRM Messaging Config
  admin.html:2971:            if (document.getElementById('conf-msgTemplate1')) storeConfig.msgTemplate1 = 
document.getElementById('conf-msgTemplate1').value;
  admin.html:2972:            if (document.getElementById('conf-msgTemplate2')) storeConfig.msgTemplate2 = 
document.getElementById('conf-msgTemplate2').value;
  admin.html:2973:            if (document.getElementById('conf-sendOnlyStep1')) storeConfig.sendOnlyStep1 = 
document.getElementById('conf-sendOnlyStep1').value === 'true';
  admin.html:2974:            if (document.getElementById('conf-msgDiscountAmount')) storeConfig.msgDiscountAmount = 
parseInt(document.getElementById('conf-msgDiscountAmount').value) || 0;
  admin.html:2975:            if (document.getElementById('conf-useLocalRobotCRM')) storeConfig.useLocalRobotCRM = 
document.getElementById('conf-useLocalRobotCRM').value === 'true';
  admin.html:2976:
  admin.html:2977:            const newCrmDict = {};
  admin.html:2978:            const newCrmPlatforms = {};
  admin.html:2979:            const platformsContainer = document.getElementById('crm-platforms-container');
  admin.html:2980:            if (platformsContainer) {
  admin.html:2981:                platformsContainer.querySelectorAll('.crm-platform-section').forEach((section, 
index) => {
  admin.html:2982:                    let name = section.querySelector('.platform-name-input').value.trim();
  admin.html:2983:                    let variant = section.querySelector('.platform-variant-input').value.trim();
  admin.html:2984:                    let guideUrl = section.querySelector('.platform-guide-url').value.trim();
  admin.html:2985:                    
  admin.html:2986:                    if (!name) name = "Carpeta " + (index + 1);
  admin.html:2987:                    
  admin.html:2988:                    let keyBase = variant ? `${name} | ${variant}` : name;
  admin.html:2989:                    let finalName = keyBase;
  admin.html:2990:                    let counter = 1;
  admin.html:2991:                    while (newCrmDict.hasOwnProperty(finalName)) {
  admin.html:2992:                        finalName = keyBase + " (" + counter + ")";
  admin.html:2993:                        counter++;
  admin.html:2994:                    }
  admin.html:2995:
  admin.html:2996:                    const items = [];
  admin.html:2997:                    section.querySelectorAll('.gallery-item').forEach(item => {
  admin.html:2998:                        const photo = item.querySelector('.gallery-photo').value.trim();
  admin.html:2999:                        const text = item.querySelector('.gallery-text').value.trim();
  admin.html:3000:                        if (photo || text) items.push({ photo, text });
  admin.html:3001:                    });
  admin.html:3002:                    
  admin.html:3003:                    newCrmDict[finalName] = items;
  admin.html:3004:                    newCrmPlatforms[finalName] = { name: finalName, manualUrl: guideUrl };
  admin.html:3005:                });
  admin.html:3006:            }
  admin.html:3007:            storeConfig.crmGalleryDict = newCrmDict;
  admin.html:3008:            storeConfig.crmPlatforms = newCrmPlatforms;
  admin.html:3009:            storeConfig.crmGallery = []; 
  admin.html:3010:
  admin.html:3011:            db.ref('storeConfig').set(storeConfig).then(() => {
  admin.html:3012:                alert('¡Configuración guardada exitosamente!');
  admin.html:3013:            });
  admin.html:3014:        }
  admin.html:3015:
  admin.html:3016:        function renderEstrenosList() {
  admin.html:3017:            const listDiv = document.getElementById('admin-list-estrenos');
  admin.html:3018:            listDiv.innerHTML = '';
  admin.html:3019:            let estrenosRaw = storeConfig.estrenos || [];
  admin.html:3020:            const estrenos = Array.isArray(estrenosRaw) ? estrenosRaw : Object.values(estrenosRaw);
  admin.html:3021:
  admin.html:3022:            estrenos.forEach((e, index) => {
  admin.html:3023:                if (!e) return;
  admin.html:3024:                const div = document.createElement('div');
  admin.html:3025:                div.className = 'admin-item';
  admin.html:3026:                div.innerHTML = `
  admin.html:3027:                    <div></div>
  admin.html:3028:                    <div>
  admin.html:3029:                        <strong style="color: white">${e.title}</strong> 
  admin.html:3030:                        <span style="font-size: 0.7rem; background: var(--accent-primary); color: 
white; padding: 2px 5px; border-radius: 4px; margin-left: 5px;">${e.month || 'Sin mes'}</span><br>
  admin.html:3031:                        <span style="font-size: 0.8rem; color: #a0a0a0; word-break: 
break-all;">${e.url}</span>
  admin.html:3032:                    </div>
  admin.html:3033:                    <div class="item-actions">
  admin.html:3034:                        <button class="btn-icon btn-edit" onclick="editEstreno(${index})" 
title="Editar">
  admin.html:3035:                            <i class="fa-solid fa-pen"></i>
  admin.html:3036:                        </button>
  admin.html:3037:                        <button class="btn-icon btn-delete" onclick="deleteEstreno(${index})" 
title="Eliminar">
  admin.html:3038:                            <i class="fa-solid fa-trash"></i>
  admin.html:3039:                        </button>
  admin.html:3040:                    </div>
  admin.html:3041:                `;
  admin.html:3042:                listDiv.appendChild(div);
  admin.html:3043:            });
  admin.html:3044:        }
  admin.html:3045:
  admin.html:3046:        function editEstreno(index) {
  admin.html:3047:            editEstrenoIndex = index;
  admin.html:3048:            const e = storeConfig.estrenos[index];
  admin.html:3049:            document.getElementById('new-estreno-title').value = e.title;
  admin.html:3050:            document.getElementById('new-estreno-url').value = e.url;
  admin.html:3051:            if (e.month) document.getElementById('new-estreno-month').value = e.month;
  admin.html:3052:
  admin.html:3053:            document.getElementById('estreno-form-title').innerText = "Editar Película / Estreno";
  admin.html:3054:            document.getElementById('btn-save-estreno').innerText = "Actualizar Estreno";
  admin.html:3055:            document.getElementById('btn-cancel-estreno').style.display = 'block';
  admin.html:3056:            window.scrollTo({ top: 0, behavior: 'smooth' });
  admin.html:3057:        }
  admin.html:3058:
  admin.html:3059:        function cancelEditEstreno() {
  admin.html:3060:            editEstrenoIndex = -1;
  admin.html:3061:            document.getElementById('new-estreno-title').value = '';
  admin.html:3062:            document.getElementById('new-estreno-url').value = '';
  admin.html:3063:            document.getElementById('new-estreno-month').value = 'Enero';
  admin.html:3064:            document.getElementById('estreno-form-title').innerText = "Agregar Película / Estreno";
  admin.html:3065:            document.getElementById('btn-save-estreno').innerText = "Guardar Estreno";
  admin.html:3066:            document.getElementById('btn-cancel-estreno').style.display = 'none';
  admin.html:3067:        }
  admin.html:3068:
  admin.html:3069:        function saveEstreno() {
  admin.html:3070:            const title = document.getElementById('new-estreno-title').value.trim();
  admin.html:3071:            const url = document.getElementById('new-estreno-url').value.trim();
  admin.html:3072:            const month = document.getElementById('new-estreno-month').value;
  admin.html:3073:            if (!title || !url) return alert('Completa título y enlace.');
  admin.html:3074:
  admin.html:3075:            if (!storeConfig.estrenos) storeConfig.estrenos = [];
  admin.html:3076:
  admin.html:3077:            if (editEstrenoIndex !== -1) {
  admin.html:3078:                storeConfig.estrenos[editEstrenoIndex] = { title, url, month };
  admin.html:3079:            } else {
  admin.html:3080:                storeConfig.estrenos.unshift({ title, url, month });
  admin.html:3081:            }
  admin.html:3082:
  admin.html:3083:            db.ref('storeConfig').set(storeConfig);
  admin.html:3084:
  admin.html:3085:            cancelEditEstreno();
  admin.html:3086:            renderEstrenosList();
  admin.html:3087:        }
  admin.html:3088:
  admin.html:3089:        function deleteEstreno(index) {
  admin.html:3090:            if (confirm('¿Eliminar película?')) {
  admin.html:3091:                storeConfig.estrenos.splice(index, 1);
  admin.html:3092:                db.ref('storeConfig').set(storeConfig);
  admin.html:3093:                renderEstrenosList();
  admin.html:3094:            }
  admin.html:3095:        }
  admin.html:3096:
  admin.html:3097:        // --- SECTION BANNERS ---
  admin.html:3098:        let editBannerIndex = -1;
  admin.html:3099:
  admin.html:3100:        function saveBannerToggle() {
  admin.html:3101:            storeConfig.mainBannerEnabled = document.getElementById('conf-mainBannerEnabled').value 
=== 'true';
  admin.html:3102:            db.ref('storeConfig').set(storeConfig);
  admin.html:3103:        }
  admin.html:3104:
  admin.html:3105:        function renderBannersList() {
  admin.html:3106:            if (document.getElementById('conf-mainBannerEnabled')) 
document.getElementById('conf-mainBannerEnabled').value = storeConfig.mainBannerEnabled === true ? 'true' : 'false';
  admin.html:3107:
  admin.html:3108:            const listDiv = document.getElementById('admin-list-main-banners');
  admin.html:3109:            listDiv.innerHTML = '';
  admin.html:3110:            let bannersRaw = storeConfig.mainBanners || [];
  admin.html:3111:            const banners = Array.isArray(bannersRaw) ? bannersRaw : Object.values(bannersRaw);
  admin.html:3112:
  admin.html:3113:            banners.forEach((b, index) => {
  admin.html:3114:                if (!b) return;
  admin.html:3115:                const div = document.createElement('div');
  admin.html:3116:                div.className = 'admin-item';
  admin.html:3117:                div.innerHTML = `
  admin.html:3118:                    <div style="width: 50px; height: 50px; background-image: url('${b.img}'); 
background-size: cover; background-position: center; border-radius: 8px;"></div>
  admin.html:3119:                    <div style="flex:1; margin-left: 10px;">
  admin.html:3120:                        <strong style="color: white">${b.title}</strong> <span style="font-size: 
0.7rem; background:#ff416c; color:white; padding: 2px 5px; border-radius: 4px;">${b.badge}</span><br>
  admin.html:3121:                        <span style="font-size: 0.8rem; color: #a0a0a0;">${b.desc}</span>
  admin.html:3122:                    </div>
  admin.html:3123:                    <div class="item-actions">
  admin.html:3124:                        <button class="btn-icon btn-edit" onclick="moveBannerUp(${index})" 
title="Subir (Ver Primero)">
  admin.html:3125:                            <i class="fa-solid fa-arrow-up"></i>
  admin.html:3126:                        </button>
  admin.html:3127:                        <button class="btn-icon btn-edit" onclick="moveBannerDown(${index})" 
title="Bajar">
  admin.html:3128:                            <i class="fa-solid fa-arrow-down"></i>
  admin.html:3129:                        </button>
  admin.html:3130:                        <button class="btn-icon btn-edit" onclick="editBanner(${index})" 
title="Editar">
  admin.html:3131:                            <i class="fa-solid fa-pen"></i>
  admin.html:3132:                        </button>
  admin.html:3133:                        <button class="btn-icon btn-delete" onclick="deleteBanner(${index})" 
title="Eliminar">
  admin.html:3134:                            <i class="fa-solid fa-trash"></i>
  admin.html:3135:                        </button>
  admin.html:3136:                    </div>
  admin.html:3137:                `;
  admin.html:3138:                listDiv.appendChild(div);
  admin.html:3139:            });
  admin.html:3140:        }
  admin.html:3141:
  admin.html:3142:        function editBanner(index) {
  admin.html:3143:            editBannerIndex = index;
  admin.html:3144:            const b = storeConfig.mainBanners[index];
  admin.html:3145:            document.getElementById('new-banner-badge').value = b.badge;
  admin.html:3146:            document.getElementById('new-banner-title').value = b.title;
  admin.html:3147:            document.getElementById('new-banner-desc').value = b.desc;
  admin.html:3148:            document.getElementById('new-banner-image').value = b.img;
  admin.html:3149:            document.getElementById('new-banner-btntext').value = b.btnText;
  admin.html:3150:            document.getElementById('new-banner-btnlink').value = b.btnLink;
  admin.html:3151:
  admin.html:3152:            document.getElementById('banner-form-title').innerText = "Editar Banner";
  admin.html:3153:            document.getElementById('btn-save-banner').innerText = "Actualizar Banner";
  admin.html:3154:            document.getElementById('btn-cancel-banner').style.display = 'block';
  admin.html:3155:            window.scrollTo({ top: 0, behavior: 'smooth' });
  admin.html:3156:        }
  admin.html:3157:
  admin.html:3158:        function cancelEditBanner() {
  admin.html:3159:            editBannerIndex = -1;
  admin.html:3160:            document.getElementById('new-banner-badge').value = '';
  admin.html:3161:            document.getElementById('new-banner-title').value = '';
  admin.html:3162:            document.getElementById('new-banner-desc').value = '';
  admin.html:3163:            document.getElementById('new-banner-image').value = '';
  admin.html:3164:            document.getElementById('new-banner-btntext').value = '';
  admin.html:3165:            document.getElementById('new-banner-btnlink').value = '';
  admin.html:3166:
  admin.html:3167:            document.getElementById('banner-form-title').innerText = "Agregar Nuevo Banner";
  admin.html:3168:            document.getElementById('btn-save-banner').innerText = "Guardar Banner";
  admin.html:3169:            document.getElementById('btn-cancel-banner').style.display = 'none';
  admin.html:3170:        }
  admin.html:3171:
  admin.html:3172:        function saveBanner() {
  admin.html:3173:            const badge = document.getElementById('new-banner-badge').value.trim();
  admin.html:3174:            const title = document.getElementById('new-banner-title').value.trim();
  admin.html:3175:            const desc = document.getElementById('new-banner-desc').value.trim();
  admin.html:3176:            const img = document.getElementById('new-banner-image').value.trim();
  admin.html:3177:            const btnText = document.getElementById('new-banner-btntext').value.trim();
  admin.html:3178:            const btnLink = document.getElementById('new-banner-btnlink').value.trim();
  admin.html:3179:
  admin.html:3180:            if (!title) return alert('El título es requerido.');
  admin.html:3181:
  admin.html:3182:            if (!storeConfig.mainBanners) storeConfig.mainBanners = [];
  admin.html:3183:
  admin.html:3184:            if (editBannerIndex !== -1) {
  admin.html:3185:                storeConfig.mainBanners[editBannerIndex] = { badge, title, desc, img, btnText, 
btnLink };
  admin.html:3186:            } else {
  admin.html:3187:                if (storeConfig.mainBanners.length >= 10) return alert('El máximo de banners 
permitidos es 10. Elimina uno primero.');
  admin.html:3188:                storeConfig.mainBanners.push({ badge, title, desc, img, btnText, btnLink });
  admin.html:3189:            }
  admin.html:3190:
  admin.html:3191:            db.ref('storeConfig').set(storeConfig);
  admin.html:3192:
  admin.html:3193:            cancelEditBanner();
  admin.html:3194:            renderBannersList();
  admin.html:3195:        }
  admin.html:3196:
  admin.html:3197:        function deleteBanner(index) {
  admin.html:3198:            if (confirm('¿Eliminar banner?')) {
  admin.html:3199:                storeConfig.mainBanners.splice(index, 1);
  admin.html:3200:                db.ref('storeConfig').set(storeConfig);
  admin.html:3201:                renderBannersList();
  admin.html:3202:            }
  admin.html:3203:        }
  admin.html:3204:
  admin.html:3205:        function moveBannerUp(index) {
  admin.html:3206:            if (index === 0) return;
  admin.html:3207:            const b = storeConfig.mainBanners.splice(index, 1)[0];
  admin.html:3208:            storeConfig.mainBanners.splice(index - 1, 0, b);
  admin.html:3209:            db.ref('storeConfig').set(storeConfig);
  admin.html:3210:            renderBannersList();
  admin.html:3211:        }
  admin.html:3212:
  admin.html:3213:        function moveBannerDown(index) {
  admin.html:3214:            if (index === storeConfig.mainBanners.length - 1) return;
  admin.html:3215:            const b = storeConfig.mainBanners.splice(index, 1)[0];
  admin.html:3216:            storeConfig.mainBanners.splice(index + 1, 0, b);
  admin.html:3217:            db.ref('storeConfig').set(storeConfig);
  admin.html:3218:            renderBannersList();
  admin.html:3219:        }
  admin.html:3220:
  admin.html:3221:        // --- SECTION VENDEDORES ---
  admin.html:3222:        function renderSellersList() {
  admin.html:3223:            const listDiv = document.getElementById('admin-list-sellers');
  admin.html:3224:            listDiv.innerHTML = '';
  admin.html:3225:            let sellersRaw = storeConfig.sellers || [];
  admin.html:3226:            const sellers = Array.isArray(sellersRaw) ? sellersRaw : Object.values(sellersRaw || {});
  admin.html:3227:
  admin.html:3228:            sellers.forEach((s, index) => {
  admin.html:3229:                if (!s) return;
  admin.html:3230:                const div = document.createElement('div');
  admin.html:3231:                div.className = 'admin-item';
  admin.html:3232:                div.innerHTML = `
  admin.html:3233:                    <div><i class="fa-solid fa-user-tie" style="color:#c48dfc; 
font-size:1.5rem"></i></div>
  admin.html:3234:                    <div>
  admin.html:3235:                        <strong style="color: white; font-size:1.1rem">${s.name}</strong><br>
  admin.html:3236:                        <span style="font-size: 0.8rem; color: #a0a0a0;">Wa: ${s.whatsapp || 'No 
registrado'} | Pass: ${s.password}</span><br>
  admin.html:3237:                        <span style="font-size: 0.8rem; color: #f39c12;">Ventas Extras: 
${s.extraSalesEnabled ? 'Sí (Límite ' + (s.extraProductsLimit || 0) + ')' : 'No'}</span>
  admin.html:3238:                    </div>
  admin.html:3239:                    <div class="item-actions">
  admin.html:3240:                        <button class="btn-icon btn-edit" onclick="editSeller(${index})" 
title="Editar Vendedor">
  admin.html:3241:                            <i class="fa-solid fa-pen"></i>
  admin.html:3242:                        </button>
  admin.html:3243:                        <button class="btn-icon btn-delete" onclick="deleteSeller(${index})" 
title="Eliminar Vendedor">
  admin.html:3244:                            <i class="fa-solid fa-trash"></i>
  admin.html:3245:                        </button>
  admin.html:3246:                    </div>
  admin.html:3247:                `;
  admin.html:3248:                listDiv.appendChild(div);
  admin.html:3249:            });
  admin.html:3250:        }
  admin.html:3251:
  admin.html:3252:        function editSeller(index) {
  admin.html:3253:            editSellerIndex = index;
  admin.html:3254:            const s = storeConfig.sellers[index];
  admin.html:3255:            document.getElementById('new-seller-name').value = s.name;
  admin.html:3256:            const waInput = document.getElementById('new-seller-whatsapp');
  admin.html:3257:            if (waInput) waInput.value = s.whatsapp || '';
  admin.html:3258:            document.getElementById('new-seller-pass').value = s.password;
  admin.html:3259:            const selExtras = document.getElementById('new-seller-extras-enabled');
  admin.html:3260:            if (selExtras) selExtras.value = s.extraSalesEnabled === true ? 'true' : 'false';
  admin.html:3261:            const selLimit = document.getElementById('new-seller-extras-limit');
  admin.html:3262:            if (selLimit) selLimit.value = s.extraProductsLimit || 0;
  admin.html:3263:
  admin.html:3264:            document.getElementById('btn-save-seller').innerText = "Actualizar Vendedor";
  admin.html:3265:            document.getElementById('btn-cancel-seller').style.display = 'block';
  admin.html:3266:            window.scrollTo({ top: 0, behavior: 'smooth' });
  admin.html:3267:        }
  admin.html:3268:
  admin.html:3269:        function cancelEditSeller() {
  admin.html:3270:            editSellerIndex = -1;
  admin.html:3271:            document.getElementById('new-seller-name').value = '';
  admin.html:3272:            const waInput = document.getElementById('new-seller-whatsapp');
  admin.html:3273:            if (waInput) waInput.value = '';
  admin.html:3274:            document.getElementById('new-seller-pass').value = '';
  admin.html:3275:            const selExtras = document.getElementById('new-seller-extras-enabled');
  admin.html:3276:            if (selExtras) selExtras.value = 'false';
  admin.html:3277:            const selLimit = document.getElementById('new-seller-extras-limit');
  admin.html:3278:            if (selLimit) selLimit.value = '0';
  admin.html:3279:            document.getElementById('btn-save-seller').innerText = "Añadir Vendedor";
  admin.html:3280:            document.getElementById('btn-cancel-seller').style.display = 'none';
  admin.html:3281:        }
  admin.html:3282:
  admin.html:3283:        function saveSeller() {
  admin.html:3284:            const name = document.getElementById('new-seller-name').value.trim();
  admin.html:3285:            const waInput = document.getElementById('new-seller-whatsapp');
  admin.html:3286:            const whatsapp = waInput ? waInput.value.trim().replace(/\D/g, '') : '';
  admin.html:3287:            const password = document.getElementById('new-seller-pass').value.trim();
  admin.html:3288:            if (!name || !password) return alert('Completa nombre y contraseña.');
  admin.html:3289:
  admin.html:3290:            const selExtras = document.getElementById('new-seller-extras-enabled');
  admin.html:3291:            const extraSalesEnabled = selExtras ? selExtras.value === 'true' : false;
  admin.html:3292:            const selLimit = document.getElementById('new-seller-extras-limit');
  admin.html:3293:            const extraProductsLimit = selLimit ? parseInt(selLimit.value) || 0 : 0;
  admin.html:3294:
  admin.html:3295:            let sellersRaw = storeConfig.sellers || [];
  admin.html:3296:            storeConfig.sellers = Array.isArray(sellersRaw) ? sellersRaw : Object.values(sellersRaw 
|| {});
  admin.html:3297:
  admin.html:3298:            if (editSellerIndex !== -1) {
  admin.html:3299:                storeConfig.sellers[editSellerIndex] = { name, whatsapp, password, 
extraSalesEnabled, extraProductsLimit };
  admin.html:3300:            } else {
  admin.html:3301:                storeConfig.sellers.push({ name, whatsapp, password, extraSalesEnabled, 
extraProductsLimit });
  admin.html:3302:            }
  admin.html:3303:
  admin.html:3304:            db.ref('storeConfig').set(storeConfig).then(() => {
  admin.html:3305:                cancelEditSeller();
  admin.html:3306:                renderSellersList();
  admin.html:3307:                alert(editSellerIndex !== -1 ? 'Vendedor actualizado con éxito.' : 'Vendedor añadido 
con éxito en la Nube.');
  admin.html:3308:            });
  admin.html:3309:        }
  admin.html:3310:
  admin.html:3311:        function deleteSeller(index) {
  admin.html:3312:            if (confirm('¿Eliminar/Bloquear este vendedor? Perderá su acceso.')) {
  admin.html:3313:                let sellersRaw = storeConfig.sellers || [];
  admin.html:3314:                storeConfig.sellers = Array.isArray(sellersRaw) ? sellersRaw : 
Object.values(sellersRaw || {});
  admin.html:3315:                storeConfig.sellers.splice(index, 1);
  admin.html:3316:                db.ref('storeConfig').set(storeConfig);
  admin.html:3317:                cancelEditSeller();
  admin.html:3318:                renderSellersList();
  admin.html:3319:            }
  admin.html:3320:        }
  admin.html:3321:
  admin.html:3322:        let globalSellerSalesDataStore = {};
  admin.html:3323:        function fetchSellerSalesStats() {
  admin.html:3324:            renderSellerSalesStats();
  admin.html:3325:        }
  admin.html:3326:
  admin.html:3327:        let categoryChart = null;
  admin.html:3328:        let historyChart = null;
  admin.html:3329:
  admin.html:3330:        window.renderStats = function() {
  admin.html:3331:            const filterMonth = parseInt(document.getElementById('stats-month-filter').value);
  admin.html:3332:            const filterYear = parseInt(document.getElementById('stats-year-filter').value);
  admin.html:3333:            
  admin.html:3334:            if (isNaN(filterMonth)) {
  admin.html:3335:                // Initialize filters with current date
  admin.html:3336:                const now = new Date();
  admin.html:3337:                document.getElementById('stats-month-filter').value = now.getMonth();
  admin.html:3338:                document.getElementById('stats-year-filter').value = now.getFullYear();
  admin.html:3339:            }
  admin.html:3340:
  admin.html:3341:            let totalIncome = 0;
  admin.html:3342:            let totalCost = 0;
  admin.html:3343:            let totalSalesCount = 0;
  admin.html:3344:            const productStats = {}; // { name: { count: 0, income: 0, cost: 0 } }
  admin.html:3345:            const categoryStats = {}; // { cat: count }
  admin.html:3346:            const monthlyHistory = {}; // { "YYYY-MM": income }
  admin.html:3347:
  admin.html:3348:            // Procesar Ventas Directas
  admin.html:3349:            Object.keys(window.allClientSalesMap || {}).forEach(phone => {
  admin.html:3350:                const sales = window.allClientSalesMap[phone];
  admin.html:3351:                Object.keys(sales).forEach(key => {
  admin.html:3352:                    const s = sales[key];
  admin.html:3353:                    if (s.isPaid === false) return; // Omitir no pagados
  admin.html:3354:
  admin.html:3355:                    const sDate = new Date(s.date);
  admin.html:3356:                    const month = sDate.getMonth();
  admin.html:3357:                    const year = sDate.getFullYear();
  admin.html:3358:                    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  admin.html:3359:                    
  admin.html:3360:                    // Histórico (siempre recolectar)
  admin.html:3361:                    monthlyHistory[monthKey] = (monthlyHistory[monthKey] || 0) + (s.total || 0);
  admin.html:3362:
  admin.html:3363:                    // Filtrado para resumen actual
  admin.html:3364:                    if (month === parseInt(document.getElementById('stats-month-filter').value) && 
  admin.html:3365:                        year === parseInt(document.getElementById('stats-year-filter').value)) {
  admin.html:3366:                        
  admin.html:3367:                        totalIncome += (s.total || 0);
  admin.html:3368:                        totalSalesCount++;
  admin.html:3369:
  admin.html:3370:                        const items = Array.isArray(s.items) ? s.items : Object.values(s.items || 
{});
  admin.html:3371:                        items.forEach(it => {
  admin.html:3372:                            // Buscar costo en el catálogo actual
  admin.html:3373:                            const prod = dynamicProducts.find(p => p.name === it.name || p.id === 
it.id);
  admin.html:3374:                            const cost = prod ? (prod.purchasePrice || 0) : 0;
  admin.html:3375:                            totalCost += cost;
  admin.html:3376:
  admin.html:3377:                            // Stats por producto
  admin.html:3378:                            if (!productStats[it.name]) productStats[it.name] = { count: 0, income: 
0, cost: 0 };
  admin.html:3379:                            productStats[it.name].count++;
  admin.html:3380:                            productStats[it.name].income += (it.finalPrice || 0);
  admin.html:3381:                            productStats[it.name].cost += cost;
  admin.html:3382:
  admin.html:3383:                            // Stats por categoría
  admin.html:3384:                            const cat = it.category || 'Otros';
  admin.html:3385:                            categoryStats[cat] = (categoryStats[cat] || 0) + 1;
  admin.html:3386:                        });
  admin.html:3387:                    }
  admin.html:3388:                });
  admin.html:3389:            });
  admin.html:3390:
  admin.html:3391:            // NOTA: sellerSales NO se suma aquí porque cada venta ya está en clientSales.
  admin.html:3392:            // sellerSales es solo para el panel de vendedores. Sumar ambos causaría doble conteo.
  admin.html:3393:
  admin.html:3394:            // Sin embargo, usamos sellerSales solo para el historial mensual de ventas SIN número 
de celular
  admin.html:3395:            // (ventas que no tienen clientSales porque no se capturó el teléfono)
  admin.html:3396:            const clientSaleDates = new Set();
  admin.html:3397:            Object.keys(window.allClientSalesMap || {}).forEach(phone => {
  admin.html:3398:                Object.keys(window.allClientSalesMap[phone] || {}).forEach(key => {
  admin.html:3399:                    const s = window.allClientSalesMap[phone][key];
  admin.html:3400:                    if (s.date) clientSaleDates.add(s.date + '_' + 
(s.clientPhone||'').replace(/\D/g,''));
  admin.html:3401:                });
  admin.html:3402:            });
  admin.html:3403:
  admin.html:3404:            // Historial mensual desde sellerSales (solo los que no están ya en clientSales)
  admin.html:3405:            Object.keys(window.globalSellerSalesDataStore || {}).forEach(seller => {
  admin.html:3406:                const sales = window.globalSellerSalesDataStore[seller];
  admin.html:3407:                Object.keys(sales).forEach(key => {
  admin.html:3408:                    const s = sales[key];
  admin.html:3409:                    if (s.isPaid === false) return;
  admin.html:3410:                    const sig = s.date + '_' + (s.clientPhone||'').replace(/\D/g,'');
  admin.html:3411:                    if (clientSaleDates.has(sig)) return; // ya está en clientSales, no contar de 
nuevo
  admin.html:3412:
  admin.html:3413:                    const sDate = new Date(s.date);
  admin.html:3414:                    const month = sDate.getMonth();
  admin.html:3415:                    const year = sDate.getFullYear();
  admin.html:3416:                    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  admin.html:3417:                    monthlyHistory[monthKey] = (monthlyHistory[monthKey] || 0) + (s.total || 0);
  admin.html:3418:                });
  admin.html:3419:            });
  admin.html:3420:
  admin.html:3421:            // Update UI Cards
  admin.html:3422:            document.getElementById('stats-total-income').innerText = 
`$${totalIncome.toLocaleString()}`;
  admin.html:3423:            document.getElementById('stats-total-cost').innerText = `$${totalCost.toLocaleString()}`;
  admin.html:3424:            document.getElementById('stats-total-profit').innerText = `$${(totalIncome - 
totalCost).toLocaleString()}`;
  admin.html:3425:            document.getElementById('stats-total-sales').innerText = totalSalesCount;
  admin.html:3426:
  admin.html:3427:            // Render Top Products
  admin.html:3428:            const topProductsDiv = document.getElementById('stats-top-products');
  admin.html:3429:            topProductsDiv.innerHTML = '';
  admin.html:3430:            const sortedProds = Object.keys(productStats).sort((a,b) => productStats[b].count - 
productStats[a].count).slice(0, 5);
  admin.html:3431:            
  admin.html:3432:            if (sortedProds.length === 0) {
  admin.html:3433:                topProductsDiv.innerHTML = '<p style="color:#777; text-align:center;">No hay datos 
para este periodo.</p>';
  admin.html:3434:            }
  admin.html:3435:
  admin.html:3436:            sortedProds.forEach((name, i) => {
  admin.html:3437:                const data = productStats[name];
  admin.html:3438:                const profit = data.income - data.cost;
  admin.html:3439:                const item = document.createElement('div');
  admin.html:3440:                item.style = 'display:flex; justify-content:space-between; align-items:center; 
background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;';
  admin.html:3441:                item.innerHTML = `
  admin.html:3442:                    <div style="flex:1;">
  admin.html:3443:                        <span style="color:#f1c40f; font-weight:bold; 
margin-right:8px;">#${i+1}</span>
  admin.html:3444:                        <strong style="color:white; font-size:0.9rem;">${name}</strong><br>
  admin.html:3445:                        <small style="color:#aaa;">${data.count} ventas | Ganancia: 
$${profit.toLocaleString()}</small>
  admin.html:3446:                    </div>
  admin.html:3447:                    <div style="text-align:right;">
  admin.html:3448:                        <span style="color:#4cd137; 
font-weight:bold;">$${data.income.toLocaleString()}</span>
  admin.html:3449:                    </div>
  admin.html:3450:                `;
  admin.html:3451:                topProductsDiv.appendChild(item);
  admin.html:3452:            });
  admin.html:3453:
  admin.html:3454:            // Render Category Chart (Donut)
  admin.html:3455:            const catCtx = document.getElementById('stats-category-chart').getContext('2d');
  admin.html:3456:            if (categoryChart) categoryChart.destroy();
  admin.html:3457:            
  admin.html:3458:            const catLabels = Object.keys(categoryStats);
  admin.html:3459:            const catData = Object.values(categoryStats);
  admin.html:3460:            
  admin.html:3461:            categoryChart = new Chart(catCtx, {
  admin.html:3462:                type: 'doughnut',
  admin.html:3463:                data: {
  admin.html:3464:                    labels: catLabels,
  admin.html:3465:                    datasets: [{
  admin.html:3466:                        data: catData,
  admin.html:3467:                        backgroundColor: ['#3498db', '#f1c40f', '#e74c3c', '#2ecc71', '#9b59b6', 
'#1abc9c', '#e67e22'],
  admin.html:3468:                        borderWidth: 0
  admin.html:3469:                    }]
  admin.html:3470:                },
  admin.html:3471:                options: {
  admin.html:3472:                    responsive: true,
  admin.html:3473:                    maintainAspectRatio: false,
  admin.html:3474:                    plugins: {
  admin.html:3475:                        legend: { position: 'right', labels: { color: '#ccc', font: { size: 10 } } }
  admin.html:3476:                    }
  admin.html:3477:                }
  admin.html:3478:            });
  admin.html:3479:
  admin.html:3480:            // Render History Chart (Bares)
  admin.html:3481:            const histCtx = document.getElementById('stats-history-chart').getContext('2d');
  admin.html:3482:            if (historyChart) historyChart.destroy();
  admin.html:3483:
  admin.html:3484:            const sortedMonths = Object.keys(monthlyHistory).sort().slice(-6);
  admin.html:3485:            const histData = sortedMonths.map(m => monthlyHistory[m]);
  admin.html:3486:
  admin.html:3487:            historyChart = new Chart(histCtx, {
  admin.html:3488:                type: 'bar',
  admin.html:3489:                data: {
  admin.html:3490:                    labels: sortedMonths,
  admin.html:3491:                    datasets: [{
  admin.html:3492:                        label: 'Ingresos Mensuales',
  admin.html:3493:                        data: histData,
  admin.html:3494:                        backgroundColor: 'rgba(76, 209, 55, 0.5)',
  admin.html:3495:                        borderColor: '#4cd137',
  admin.html:3496:                        borderWidth: 1
  admin.html:3497:                    }]
  admin.html:3498:                },
  admin.html:3499:                options: {
  admin.html:3500:                    responsive: true,
  admin.html:3501:                    maintainAspectRatio: false,
  admin.html:3502:                    scales: {
  admin.html:3503:                        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { 
color: '#aaa' } },
  admin.html:3504:                        x: { grid: { display: false }, ticks: { color: '#aaa' } }
  admin.html:3505:                    },
  admin.html:3506:                    plugins: { legend: { display: false } }
  admin.html:3507:                }
  admin.html:3508:            });
  admin.html:3509:        };
  admin.html:3510:
  admin.html:3511:        // =====================================================
  admin.html:3512:        // AUDITORÍA DE TRANSACCIONES (Anti-duplicados)
  admin.html:3513:        // =====================================================
  admin.html:3514:        window.renderAuditoria = function() {
  admin.html:3515:            const filterMonth = parseInt(document.getElementById('stats-month-filter').value);
  admin.html:3516:            const filterYear  = parseInt(document.getElementById('stats-year-filter').value);
  admin.html:3517:            const searchQ     = (document.getElementById('audit-search')?.value || '').toLowerCase();
  admin.html:3518:            const sourceFilter = document.getElementById('audit-source-filter')?.value || 'all';
  admin.html:3519:
  admin.html:3520:            const listEl    = document.getElementById('audit-list');
  admin.html:3521:            const summaryEl = document.getElementById('audit-summary');
  admin.html:3522:            if (!listEl) return;
  admin.html:3523:            listEl.innerHTML = '<p style="color:#aaa; text-align:center;"><i class="fa-solid 
fa-spinner fa-spin"></i> Cargando...</p>';
  admin.html:3524:
  admin.html:3525:            // Recolectar todos los registros
  admin.html:3526:            const allRecords = [];
  admin.html:3527:
  admin.html:3528:            // Desde clientSales
  admin.html:3529:            Object.keys(window.allClientSalesMap || {}).forEach(phone => {
  admin.html:3530:                const sales = window.allClientSalesMap[phone] || {};
  admin.html:3531:                Object.keys(sales).forEach(saleId => {
  admin.html:3532:                    const s = sales[saleId];
  admin.html:3533:                    const sDate = new Date(s.date);
  admin.html:3534:                    if (sDate.getMonth() === filterMonth && sDate.getFullYear() === filterYear) {
  admin.html:3535:                        allRecords.push({ source: 'clientSales', sourceId: phone, saleId, data: s, 
dateMs: s.date });
  admin.html:3536:                    }
  admin.html:3537:                });
  admin.html:3538:            });
  admin.html:3539:
  admin.html:3540:            // Desde sellerSales
  admin.html:3541:            Object.keys(window.globalSellerSalesDataStore || {}).forEach(seller => {
  admin.html:3542:                const sales = window.globalSellerSalesDataStore[seller] || {};
  admin.html:3543:                Object.keys(sales).forEach(saleId => {
  admin.html:3544:                    const s = sales[saleId];
  admin.html:3545:                    const sDate = new Date(s.date);
  admin.html:3546:                    if (sDate.getMonth() === filterMonth && sDate.getFullYear() === filterYear) {
  admin.html:3547:                        allRecords.push({ source: 'sellerSales', sourceId: seller, saleId, data: s, 
dateMs: s.date });
  admin.html:3548:                    }
  admin.html:3549:                });
  admin.html:3550:            });
  admin.html:3551:
  admin.html:3552:            // Detectar duplicados REALES: misma fuente + misma fecha + mismo teléfono
  admin.html:3553:            // (clientSales + sellerSales con misma fecha es NORMAL, no es duplicado)
  admin.html:3554:            const dupSignatures = {};
  admin.html:3555:            allRecords.forEach(r => {
  admin.html:3556:                const sig = `${r.source}_${r.dateMs}_${(r.data.clientPhone || 
'').replace(/\D/g,'')}`;
  admin.html:3557:                if (!dupSignatures[sig]) dupSignatures[sig] = [];
  admin.html:3558:                dupSignatures[sig].push(r);
  admin.html:3559:            });
  admin.html:3560:
  admin.html:3561:            // Marcar duplicados (solo dentro de la misma fuente)
  admin.html:3562:            allRecords.forEach(r => {
  admin.html:3563:                const sig = `${r.source}_${r.dateMs}_${(r.data.clientPhone || 
'').replace(/\D/g,'')}`;
  admin.html:3564:                r.isDuplicate = dupSignatures[sig].length > 1;
  admin.html:3565:                r.dupGroup    = dupSignatures[sig];
  admin.html:3566:            });
  admin.html:3567:
  admin.html:3568:            // Filtrar
  admin.html:3569:            let filtered = allRecords;
  admin.html:3570:            if (sourceFilter === 'clientSales')  filtered = filtered.filter(r => r.source === 
'clientSales');
  admin.html:3571:            if (sourceFilter === 'sellerSales')   filtered = filtered.filter(r => r.source === 
'sellerSales');
  admin.html:3572:            if (sourceFilter === 'duplicates')    filtered = filtered.filter(r => r.isDuplicate);
  admin.html:3573:            if (searchQ) filtered = filtered.filter(r =>
  admin.html:3574:                ((r.data.clientName || '') + ' ' + (r.data.clientPhone || '') + ' ' + 
r.sourceId).toLowerCase().includes(searchQ)
  admin.html:3575:            );
  admin.html:3576:
  admin.html:3577:            // Ordenar por fecha desc
  admin.html:3578:            filtered.sort((a,b) => b.dateMs - a.dateMs);
  admin.html:3579:
  admin.html:3580:            // Resumen 
  admin.html:3581:            const totalClient  = allRecords.filter(r => r.source === 'clientSales').length;
  admin.html:3582:            const totalSeller  = allRecords.filter(r => r.source === 'sellerSales').length;
  admin.html:3583:            const totalDups    = allRecords.filter(r => r.isDuplicate).length;
  admin.html:3584:            const sumClient    = allRecords.filter(r => r.source === 'clientSales').reduce((a,r) => 
a + (r.data.total||0), 0);
  admin.html:3585:            const sumSeller    = allRecords.filter(r => r.source === 'sellerSales').reduce((a,r) => 
a + (r.data.total||0), 0);
  admin.html:3586:            summaryEl.innerHTML = `
  admin.html:3587:                <div onclick="document.getElementById('audit-source-filter').value='clientSales'; 
renderAuditoria();"
  admin.html:3588:                    style="background:rgba(76,209,55,0.1); border:1px solid rgba(76,209,55,0.3); 
padding:12px; border-radius:10px; text-align:center; cursor:pointer; transition:all 0.2s;" 
  admin.html:3589:                    onmouseover="this.style.background='rgba(76,209,55,0.2)'" 
onmouseout="this.style.background='rgba(76,209,55,0.1)'">
  admin.html:3590:                    <p style="margin:0; font-size:0.75rem; color:#aaa;">👤 clientSales (Lo que 
cuenta)</p>
  admin.html:3591:                    <h3 style="margin:4px 0 0; color:#4cd137;">${totalClient} reg. — 
$${sumClient.toLocaleString()}</h3>
  admin.html:3592:                    <p style="margin:4px 0 0; font-size:0.7rem; color:#4cd137; opacity:0.7;">🔍 Clic 
para filtrar</p>
  admin.html:3593:                </div>
  admin.html:3594:                <div onclick="document.getElementById('audit-source-filter').value='sellerSales'; 
renderAuditoria();"
  admin.html:3595:                    style="background:rgba(52,152,219,0.1); border:1px solid rgba(52,152,219,0.3); 
padding:12px; border-radius:10px; text-align:center; cursor:pointer; transition:all 0.2s;"
  admin.html:3596:                    onmouseover="this.style.background='rgba(52,152,219,0.2)'" 
onmouseout="this.style.background='rgba(52,152,219,0.1)'">
  admin.html:3597:                    <p style="margin:0; font-size:0.75rem; color:#aaa;">💼 sellerSales 
(Referencia)</p>
  admin.html:3598:                    <h3 style="margin:4px 0 0; color:#3498db;">${totalSeller} reg. — 
$${sumSeller.toLocaleString()}</h3>
  admin.html:3599:                    <p style="margin:4px 0 0; font-size:0.7rem; color:#3498db; opacity:0.7;">🔍 Clic 
para filtrar</p>
  admin.html:3600:                </div>
  admin.html:3601:                <div onclick="document.getElementById('audit-source-filter').value='duplicates'; 
renderAuditoria();"
  admin.html:3602:                    style="background:rgba(255,77,77,${totalDups > 0 ? '0.15' : '0.05'}); 
border:${totalDups > 0 ? '2px' : '1px'} solid rgba(255,77,77,${totalDups > 0 ? '0.6' : '0.3'}); padding:12px; 
border-radius:10px; text-align:center; cursor:pointer; transition:all 0.2s;"
  admin.html:3603:                    onmouseover="this.style.background='rgba(255,77,77,0.25)'" 
onmouseout="this.style.background='rgba(255,77,77,${totalDups > 0 ? '0.15' : '0.05'})'">
  admin.html:3604:                    <p style="margin:0; font-size:0.75rem; color:#aaa;">⚠️ Posibles Duplicados</p>
  admin.html:3605:                    <h3 style="margin:4px 0 0; color:#ff4d4d;">${totalDups} registros</h3>
  admin.html:3606:                    <p style="margin:4px 0 0; font-size:0.7rem; color:#ff4d4d; 
opacity:0.8;">${totalDups > 0 ? '🔍 Clic para ver cuáles son' : '✅ Sin duplicados'}</p>
  admin.html:3607:                </div>
  admin.html:3608:                <div onclick="document.getElementById('audit-source-filter').value='all'; 
renderAuditoria();"
  admin.html:3609:                    style="background:rgba(243,156,18,0.1); border:1px solid rgba(243,156,18,0.3); 
padding:12px; border-radius:10px; text-align:center; cursor:pointer; transition:all 0.2s;"
  admin.html:3610:                    onmouseover="this.style.background='rgba(243,156,18,0.2)'" 
onmouseout="this.style.background='rgba(243,156,18,0.1)'">
  admin.html:3611:                    <p style="margin:0; font-size:0.75rem; color:#aaa;">📊 Total Registros</p>
  admin.html:3612:                    <h3 style="margin:4px 0 0; color:#f39c12;">${allRecords.length} en total</h3>
  admin.html:3613:                    <p style="margin:4px 0 0; font-size:0.7rem; color:#f39c12; opacity:0.7;">🔍 Ver 
todos</p>
  admin.html:3614:                </div>
  admin.html:3615:            `;
  admin.html:3616:
  admin.html:3617:            if (filtered.length === 0) {
  admin.html:3618:                listEl.innerHTML = '<p style="color:#777; text-align:center; padding:2rem;">No se 
encontraron registros con ese filtro.</p>';
  admin.html:3619:                return;
  admin.html:3620:            }
  admin.html:3621:
  admin.html:3622:            listEl.innerHTML = '';
  admin.html:3623:            filtered.forEach(r => {
  admin.html:3624:                const s = r.data;
  admin.html:3625:                const isDup = r.isDuplicate;
  admin.html:3626:                const d = new Date(r.dateMs);
  admin.html:3627:                const dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  admin.html:3628:                const itemsStr = (s.items||[]).map(i=>i.name||'?').join(', ') || 'Sin detalles';
  admin.html:3629:                const sourceColor  = r.source === 'clientSales' ? '#4cd137' : '#3498db';
  admin.html:3630:                const sourceLabel  = r.source === 'clientSales' ? '👤 clientSales' : '💼 
sellerSales';
  admin.html:3631:                const borderColor  = isDup ? 'rgba(255,77,77,0.5)' : 'rgba(255,255,255,0.05)';
  admin.html:3632:                const bgColor      = isDup ? 'rgba(255,77,77,0.06)' : 'rgba(255,255,255,0.02)';
  admin.html:3633:
  admin.html:3634:                const row = document.createElement('div');
  admin.html:3635:                row.style.cssText = `background:${bgColor}; border:1px solid ${borderColor}; 
border-radius:10px; padding:10px 14px; font-size:0.82rem; display:grid; grid-template-columns: 1fr auto; gap:8px; 
align-items:center;`;
  admin.html:3636:                row.innerHTML = `
  admin.html:3637:                    <div>
  admin.html:3638:                        ${isDup ? '<span style="color:#ff4d4d; font-size:0.75rem; font-weight:bold; 
margin-right:6px;"><i class="fa-solid fa-triangle-exclamation"></i> POSIBLE DUPLICADO</span>' : ''}
  admin.html:3639:                        <span style="background:${sourceColor}; color:black; padding:2px 8px; 
border-radius:10px; font-size:0.75rem; font-weight:bold;">${sourceLabel}</span>
  admin.html:3640:                        <span style="color:#aaa; font-size:0.75rem; 
margin-left:8px;">${r.sourceId}</span><br>
  admin.html:3641:                        <strong style="color:white;">${s.clientName || 'Sin nombre'}</strong>
  admin.html:3642:                        <span style="color:#aaa;"> | 📱 ${s.clientPhone || 'Sin teléfono'}</span>
  admin.html:3643:                        <span style="color:#aaa;"> | 📅 ${dateStr}</span><br>
  admin.html:3644:                        <span style="color:var(--text-primary); font-size:0.78rem;">📦 
${itemsStr}</span>
  admin.html:3645:                        <span style="margin-left:10px; color:#4cd137; 
font-weight:bold;">$${(s.total||0).toLocaleString()}</span>
  admin.html:3646:                        ${s.isPaid === false ? '<span style="color:#ff4d4d; font-size:0.75rem; 
margin-left:8px;">[NO PAGADO]</span>' : ''}
  admin.html:3647:                    </div>
  admin.html:3648:                    <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-end;">
  admin.html:3649:                        <button 
onclick="auditDeleteRecord('${r.source}','${r.sourceId}','${r.saleId}')" 
  admin.html:3650:                            style="padding:5px 10px; border-radius:6px; border:none; 
background:#ff4d4d; color:white; cursor:pointer; font-size:0.75rem; font-weight:bold;">
  admin.html:3651:                            <i class="fa-solid fa-trash"></i> Eliminar
  admin.html:3652:                        </button>
  admin.html:3653:                        <span style="font-size:0.7rem; color:#555; word-break:break-all; 
max-width:120px; text-align:right;">${r.saleId}</span>
  admin.html:3654:                    </div>
  admin.html:3655:                `;
  admin.html:3656:                listEl.appendChild(row);
  admin.html:3657:            });
  admin.html:3658:        };
  admin.html:3659:
  admin.html:3660:        window.auditDeleteRecord = async function(source, sourceId, saleId) {
  admin.html:3661:            if (!confirm(`¿Seguro que deseas eliminar este registro de ${source}/${sourceId}?`)) 
return;
  admin.html:3662:            try {
  admin.html:3663:                await db.ref(`${source}/${sourceId}/${saleId}`).remove();
  admin.html:3664:                alert('✅ Registro eliminado correctamente.');
  admin.html:3665:                renderAuditoria();
  admin.html:3666:                renderStats();
  admin.html:3667:            } catch(e) {
  admin.html:3668:                alert('Error al eliminar: ' + e.message);
  admin.html:3669:            }
  admin.html:3670:        };
  admin.html:3671:
  admin.html:3672:        window.downloadStatsCSV = function() {
  admin.html:3673:            const filterMonth = parseInt(document.getElementById('stats-month-filter').value);
  admin.html:3674:            const filterYear = parseInt(document.getElementById('stats-year-filter').value);
  admin.html:3675:            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", 
"Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  admin.html:3676:            
  admin.html:3677:            let csv = 
"Fecha,Cliente,Telefono,Producto,Categoria,Precio_Venta,Costo_Compra,Ganancia,Vendedor\n";
  admin.html:3678:            
  admin.html:3679:            const processSales = (salesData, defaultSeller) => {
  admin.html:3680:                Object.keys(salesData || {}).forEach(phoneOrSeller => {
  admin.html:3681:                    const salesMap = salesData[phoneOrSeller];
  admin.html:3682:                    Object.keys(salesMap).forEach(key => {
  admin.html:3683:                        const s = salesMap[key];
  admin.html:3684:                        if (s.isPaid === false) return;
  admin.html:3685:
  admin.html:3686:                        const sDate = new Date(s.date);
  admin.html:3687:                        if (sDate.getMonth() === filterMonth && sDate.getFullYear() === filterYear) {
  admin.html:3688:                            const dateStr = sDate.toLocaleDateString();
  admin.html:3689:                            const clientName = safeDecode(api_fixed_client_name(s.clientName || 
'Cliente'));
  admin.html:3690:                            const clientPhone = s.clientPhone || (defaultSeller === 'Directo' ? 
phoneOrSeller : 'N/A');
  admin.html:3691:                            const seller = s.sellerName || defaultSeller;
  admin.html:3692:                            
  admin.html:3693:                            const items = Array.isArray(s.items) ? s.items : Object.values(s.items 
|| {});
  admin.html:3694:                            items.forEach(it => {
  admin.html:3695:                                const prod = dynamicProducts.find(p => p.name === it.name || p.id 
=== it.id);
  admin.html:3696:                                const cost = prod ? (prod.purchasePrice || 0) : 0;
  admin.html:3697:                                const income = it.finalPrice || 0;
  admin.html:3698:                                const profit = income - cost;
  admin.html:3699:                                const cat = it.category || 'Otros';
  admin.html:3700:                                
  admin.html:3701:                                csv += 
`"${dateStr}","${clientName}","${clientPhone}","${it.name}","${cat}",${income},${cost},${profit},"${seller}"\n`;
  admin.html:3702:                            });
  admin.html:3703:                        }
  admin.html:3704:                    });
  admin.html:3705:                });
  admin.html:3706:            };
  admin.html:3707:
  admin.html:3708:            const api_fixed_client_name = (name) => {
  admin.html:3709:                try { return decodeURIComponent(name); } catch(e) { return name; }
  admin.html:3710:            };
  admin.html:3711:
  admin.html:3712:            processSales(window.allClientSalesMap, 'Directo');
  admin.html:3713:            processSales(window.globalSellerSalesDataStore, 'Vendedor');
  admin.html:3714:
  admin.html:3715:            const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
  admin.html:3716:            const url = URL.createObjectURL(blob);
  admin.html:3717:            const a = document.createElement('a');
  admin.html:3718:            a.href = url;
  admin.html:3719:            a.download = `Reporte_StreamingDPC_${monthNames[filterMonth]}_${filterYear}.csv`;
  admin.html:3720:            a.click();
  admin.html:3721:        };
  admin.html:3722:
  admin.html:3723:        function renderSellerSalesStats() {
  admin.html:3724:            const data = globalSellerSalesDataStore;
  admin.html:3725:            const statsDiv = document.getElementById('admin-list-sellers-stats');
  admin.html:3726:            if (!statsDiv) return;
  admin.html:3727:            statsDiv.innerHTML = '';
  admin.html:3728:
  admin.html:3729:            const sellers = storeConfig.sellers || [];
  admin.html:3730:
  admin.html:3731:            if (sellers.length === 0) {
  admin.html:3732:                statsDiv.innerHTML = '<p style="color:#ccc;">No hay vendedores registrados.</p>';
  admin.html:3733:                return;
  admin.html:3734:            }
  admin.html:3735:
  admin.html:3736:            sellers.forEach(seller => {
  admin.html:3737:                const sName = seller.name;
  admin.html:3738:                const sales = data[sName] || {};
  admin.html:3739:                let count = 0;
  admin.html:3740:                let screensSold = 0;
  admin.html:3741:                let totalAccumulated = 0;
  admin.html:3742:
  admin.html:3743:                let salesArray = Object.keys(sales).map(k => ({ id: k, ...sales[k] })).sort((a, b) 
=> b.date - a.date);
  admin.html:3744:
  admin.html:3745:                const searchInputText = document.getElementById('search-ventas-vendedores') ? 
document.getElementById('search-ventas-vendedores').value.toLowerCase() : '';
  admin.html:3746:                if (searchInputText) {
  admin.html:3747:                    salesArray = salesArray.filter(sale => {
  admin.html:3748:                        const clientInfo = ((sale.clientName || '') + ' ' + (sale.clientPhone || 
'')).toLowerCase();
  admin.html:3749:                        return clientInfo.includes(searchInputText) || 
sName.toLowerCase().includes(searchInputText);
  admin.html:3750:                    });
  admin.html:3751:                }
  admin.html:3752:
  admin.html:3753:                if (searchInputText && salesArray.length === 0 && 
!sName.toLowerCase().includes(searchInputText)) {
  admin.html:3754:                     // Empty search match string for this seller: skip it entirely
  admin.html:3755:                    // Wait, we can't 'continue' inside a forEach natively, but we can return to 
emulate 'continue'.
  admin.html:3756:                    return;
  admin.html:3757:                }
  admin.html:3758:
  admin.html:3759:                salesArray.forEach(sale => {
  admin.html:3760:                    if (sale.isPaid !== false) {
  admin.html:3761:                        count++;
  admin.html:3762:                        screensSold += (sale.items || []).length;
  admin.html:3763:                        if (sale.incentiveEarned) totalAccumulated += sale.incentiveEarned;
  admin.html:3764:                    }
  admin.html:3765:                });
  admin.html:3766:
  admin.html:3767:                const redeemed = seller.bonusesRedeemed ? parseInt(seller.bonusesRedeemed) : 0;
  admin.html:3768:                let netAccumulated = totalAccumulated - redeemed;
  admin.html:3769:                if (netAccumulated < 0) netAccumulated = 0;
  admin.html:3770:                const safeSellerString = sName.replace(/'/g, "\\'");
  admin.html:3771:
  admin.html:3772:                const div = document.createElement('div');
  admin.html:3773:                div.className = 'admin-item';
  admin.html:3774:                div.style.flexDirection = 'column';
  admin.html:3775:                div.style.alignItems = 'flex-start';
  admin.html:3776:                div.style.gap = '1rem';
  admin.html:3777:
  admin.html:3778:                div.innerHTML = `
  admin.html:3779:                    <div style="display:flex; gap:1rem; width:100%; align-items:center;">
  admin.html:3780:                        <div><i class="fa-solid fa-chart-line" style="color:#4cd137; 
font-size:1.5rem"></i></div>
  admin.html:3781:                        <div style="flex:1;">
  admin.html:3782:                            <strong style="color: white; font-size:1.1rem">${sName}</strong><br>
  admin.html:3783:                            <span style="font-size: 0.9rem; color: var(--text-primary); 
margin-right:1rem;"><i class="fa-solid fa-receipt"></i> Ventas: ${count}</span>
  admin.html:3784:                            <span style="font-size: 0.9rem; color: #f39c12;"><i class="fa-solid 
fa-tv"></i> Pantallas: ${screensSold}</span><br>
  admin.html:3785:                            <div style="margin-top:0.5rem; display:flex; align-items:center; gap: 
0.5rem; flex-wrap:wrap;">
  admin.html:3786:                                <span style="background: rgba(243,156,18,0.2); border: 1px solid 
#f39c12; color: #f39c12; padding: 2px 8px; border-radius:6px; font-size:0.85rem; font-weight:bold;"><i class="fa-solid 
fa-trophy"></i> Saldo Activo: $${netAccumulated.toLocaleString()}</span>
  admin.html:3787:                            </div>
  admin.html:3788:                        </div>
  admin.html:3789:                        <div>
  admin.html:3790:                            <button onclick="redeemSellerBonuses('${safeSellerString}', 
${netAccumulated})" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); 
border:none; color:black; font-weight:bold; padding: 0.5rem 1rem; border-radius:8px; cursor:pointer;" title="Restar 
bonos porque se le han pagado/entregado">
  admin.html:3791:                                <i class="fa-solid fa-gift"></i> Canjear Bonos
  admin.html:3792:                            </button>
  admin.html:3793:                        </div>
  admin.html:3794:                    </div>
  admin.html:3795:                `;
  admin.html:3796:
  admin.html:3797:                if (salesArray.length > 0) {
  admin.html:3798:                    const salesContainer = document.createElement('div');
  admin.html:3799:                    salesContainer.style.width = '100%';
  admin.html:3800:                    salesContainer.style.display = 'grid';
  admin.html:3801:                    salesContainer.style.gridTemplateColumns = '1fr';
  admin.html:3802:                    salesContainer.style.gap = '0.8rem';
  admin.html:3803:                    salesContainer.style.marginTop = '0.5rem';
  admin.html:3804:                    salesContainer.style.paddingTop = '1rem';
  admin.html:3805:                    salesContainer.style.borderTop = '1px solid var(--glass-border)';
  admin.html:3806:
  admin.html:3807:                    salesArray.forEach(sale => {
  admin.html:3808:                        const now = Date.now();
  admin.html:3809:                        const expEndOfDay = sale.expirationDate;
  admin.html:3810:                        const isExpired = now > expEndOfDay;
  admin.html:3811:                        const daysLeft = Math.ceil((expEndOfDay - now) / (1000 * 60 * 60 * 24));
  admin.html:3812:
  admin.html:3813:                        let statusColor = '#4cd137';
  admin.html:3814:                        if (!isExpired && daysLeft <= 3) statusColor = '#f39c12';
  admin.html:3815:                        if (isExpired) statusColor = '#ff4d4d';
  admin.html:3816:
  admin.html:3817:                        const itemsStr = sale.items ? sale.items.map(i => {
  admin.html:3818:                            let formatName = i.name;
  admin.html:3819:                            if (i.category && i.category.startsWith('combos')) formatName = `🎬 
*${i.name}* (Combo Prediseñado)`;
  admin.html:3820:                            return formatName;
  admin.html:3821:                        }).join(', ') : 'Pantallas';
  admin.html:3822:                        const safeClient = safeDecode(sale.clientName || 'Desconocido');
  admin.html:3823:                        const safeSeller = encodeURIComponent(sName);
  admin.html:3824:                        const totalDisp = sale.total ? `$${sale.total.toLocaleString()}` : 'No 
registrado';
  admin.html:3825:
  admin.html:3826:                        const startDate = sale.date ? new Date(sale.date).toLocaleDateString() : 
'N/A';
  admin.html:3827:                        const endDate = sale.expirationDate ? new 
Date(sale.expirationDate).toLocaleDateString() : 'N/A';
  admin.html:3828:
  admin.html:3829:                        const saleCard = document.createElement('div');
  admin.html:3830:                        saleCard.style.padding = '1rem';
  admin.html:3831:                        saleCard.style.background = 'rgba(255,255,255,0.05)';
  admin.html:3832:                        saleCard.style.borderLeft = `4px solid ${statusColor}`;
  admin.html:3833:                        saleCard.style.borderRadius = '8px';
  admin.html:3834:                        saleCard.innerHTML = `
  admin.html:3835:                            <div style="display:flex; justify-content:space-between; margin-bottom: 
0.3rem;">
  admin.html:3836:                                <strong style="color:white; font-size:1rem; display:flex; 
align-items:center; gap:8px;">
  admin.html:3837:                                    <input type="checkbox" class="seller-sale-checkbox" 
value="${safeSeller}|${sale.id}" style="cursor:pointer; width:16px; height:16px;" title="Seleccionar para eliminar">
  admin.html:3838:                                    ${safeClient}
  admin.html:3839:                                </strong>
  admin.html:3840:                                <span style="background:${statusColor}; color:white; padding: 2px 
6px; border-radius: 6px; font-size: 0.75rem; font-weight:bold; margin-left: auto;">
  admin.html:3841:                                    ${!isExpired ? `Vence en ${daysLeft} días` : 'Vencida'}
  admin.html:3842:                                </span>
  admin.html:3843:                            </div>
  admin.html:3844:                            <div style="margin-bottom:0.5rem; display:flex;">
  admin.html:3845:                                <button onclick="toggleSaleStatus('seller', '${safeSeller}', 
'${sale.id}', ${sale.isPaid === false ? 'true' : 'false'}, '${sale.clientPhone || ''}')" 
  admin.html:3846:                                    style="padding:0.4rem 0.6rem; border-radius:8px; cursor:pointer; 
font-weight:bold; border:1px solid ${sale.isPaid === false ? '#f39c12' : '#4cd137'}; background: transparent; 
color:${sale.isPaid === false ? '#f39c12' : '#4cd137'}; font-size:0.75rem;">
  admin.html:3847:                                    <i class="fa-solid ${sale.isPaid === false ? 'fa-square' : 
'fa-check-square'}"></i> ${sale.isPaid === false ? 'Pago Pendiente (No Suma)' : 'Pagado (Contabilizada)'}
  admin.html:3848:                                </button>
  admin.html:3849:                            </div>
  admin.html:3850:                            <p style="font-size:0.8rem; color:#ccc; margin-bottom:0.8rem; 
line-height:1.4;">
  admin.html:3851:                                📱 ${sale.clientPhone || 'N/A'} | 📍 ${sale.clientCity || 'N/A'}<br>
  admin.html:3852:                                📅 Inicio: ${startDate} | ⏳ Fin: ${endDate}<br>
  admin.html:3853:                                📺 Compra: ${itemsStr}<br>
  admin.html:3854:                                💰 Valor pagado: ${totalDisp}
  admin.html:3855:                            </p>
  admin.html:3856:                            <div style="display:flex; gap:0.5rem;">
  admin.html:3857:                                <button onclick="sendAdminReminderToSeller('${safeSeller}', 
'${encodeURIComponent(safeClient)}', '${encodeURIComponent(itemsStr)}', '${sale.clientPhone || ''}', ${sale.total || 
0})" 
  admin.html:3858:                                    style="flex:1; padding:0.6rem 0.5rem; border-radius:8px; 
cursor:pointer; font-weight:bold; border:1px solid #4cd137; background: rgba(76, 209, 55, 0.1); color:#4cd137; 
font-size:0.8rem; transition: background 0.3s;"
  admin.html:3859:                                    onmouseover="this.style.background='rgba(76, 209, 55, 0.2)'" 
onmouseout="this.style.background='rgba(76, 209, 55, 0.1)'">
  admin.html:3860:                                    <i class="fa-brands fa-whatsapp"></i> Recordar
  admin.html:3861:                                </button>
  admin.html:3862:                                <button 
onclick="sendAdminRenovadaMessage('${encodeURIComponent(safeClient)}', '${sale.clientPhone || ''}', 
'${encodeURIComponent(itemsStr)}', ${(sale.items && sale.items.length > 1) ? true : false}, ${sale.expirationDate || 
0}, '${sale.id}', '${safeSeller}', 'seller')" 
  admin.html:3863:                                    style="flex:1; padding:0.6rem 0.5rem; border-radius:8px; 
cursor:pointer; font-weight:bold; border:1px solid #f39c12; background: rgba(243, 156, 18, 0.1); color:#f39c12; 
font-size:0.8rem; transition: background 0.3s;"
  admin.html:3864:                                    onmouseover="this.style.background='rgba(243, 156, 18, 0.2)'" 
onmouseout="this.style.background='rgba(243, 156, 18, 0.1)'">
  admin.html:3865:                                    <i class="fa-brands fa-whatsapp"></i> Renovada
  admin.html:3866:                                </button>
  admin.html:3867:                                ${storeConfig.crmEnabled !== false ? `
  admin.html:3868:                                <button 
onclick="openCRMPlatformSelector('${encodeURIComponent(safeClient)}', '${sale.clientPhone || ''}', '${startDate}', 
'${endDate}', '${(allClientProfiles[sale.clientPhone] ? allClientProfiles[sale.clientPhone].pin : '')}', 
'${encodeURIComponent(itemsStr)}', '${(sale.email || '').replace(/'/g, "\\'")}', '${(sale.password || 
'').replace(/'/g, "\\'")}', '${(sale.profile || '').replace(/'/g, "\\'")}', 
'${encodeURIComponent(JSON.stringify(sale.items || []))}', '${safeSeller}')" 
  admin.html:3869:                                    style="flex:1; padding:0.6rem 0.5rem; border-radius:8px; 
cursor:pointer; font-weight:bold; border:1px solid #9b59b6; background: rgba(155, 89, 182, 0.1); color:#9b59b6; 
font-size:0.8rem;">
  admin.html:3870:                                    <i class="fa-solid fa-comment-dots"></i> RESPUESTAS
  admin.html:3871:                                </button>
  admin.html:3872:                                ` : ''}
  admin.html:3873:                                <button onclick="deleteSellerSale('${safeSeller}', '${sale.id}')" 
  admin.html:3874:                                    style="padding:0.6rem 0.6rem; border-radius:8px; cursor:pointer; 
font-weight:bold; border:1px solid #ff4d4d; background: transparent; color:#ff4d4d; font-size:0.8rem;" title="Eliminar 
Registro (Prueba/Error)">
  admin.html:3875:                                    <i class="fa-solid fa-trash"></i>
  admin.html:3876:                                </button>
  admin.html:3877:                            </div>
  admin.html:3878:                        `;
  admin.html:3879:                        salesContainer.appendChild(saleCard);
  admin.html:3880:                    });
  admin.html:3881:
  admin.html:3882:                    div.appendChild(salesContainer);
  admin.html:3883:                }
  admin.html:3884:
  admin.html:3885:                statsDiv.appendChild(div);
  admin.html:3886:            });
  admin.html:3887:        }
  admin.html:3888:
  admin.html:3889:        function deleteSellerSale(sellerName, saleId) {
  admin.html:3890:            if (confirm('¿Estás seguro de que quieres eliminar este registro? (Útil si fue una 
prueba o error)')) {
  admin.html:3891:                db.ref(`sellerSales/${sellerName}/${saleId}`).remove().then(() => {
  admin.html:3892:                    alert('Registro eliminado de las ventas del vendedor.');
  admin.html:3893:                    fetchSellerSalesStats();
  admin.html:3894:                });
  admin.html:3895:            }
  admin.html:3896:        }
  admin.html:3897:
  admin.html:3898:        async function deleteSelectedSellerSales() {
  admin.html:3899:            const checkboxes = document.querySelectorAll('.seller-sale-checkbox:checked');
  admin.html:3900:            if (checkboxes.length === 0) return alert('Selecciona al menos una venta marcando la 
casilla correspondiente para eliminar.');
  admin.html:3901:
  admin.html:3902:            if (confirm(`¿Estás seguro de eliminar ${checkboxes.length} registro(s) seleccionado(s) 
de los vendedores?`)) {
  admin.html:3903:                let updates = {};
  admin.html:3904:                checkboxes.forEach(cb => {
  admin.html:3905:                    const [seller, id] = cb.value.split('|');
  admin.html:3906:                    updates[`sellerSales/${seller}/${id}`] = null;
  admin.html:3907:                });
  admin.html:3908:
  admin.html:3909:                try {
  admin.html:3910:                    await db.ref().update(updates);
  admin.html:3911:                    alert(`Registros eliminados correctamente (${checkboxes.length}).`);
  admin.html:3912:                    fetchSellerSalesStats();
  admin.html:3913:                } catch (err) {
  admin.html:3914:                    alert('Hubo un error al eliminar los registros.');
  admin.html:3915:                    console.error(err);
  admin.html:3916:                }
  admin.html:3917:            }
  admin.html:3918:        }
  admin.html:3919:
  admin.html:3920:        async function sendAdminRenovadaMessage(clientNameEnc, clientPhone, itemsEncoded, 
isMultiple, expirationDateTS, saleId, sourceNameEnc, sourceType) {
  admin.html:3921:            if (!clientPhone) return alert('Este cliente no tiene número registrado.');
  admin.html:3922:            const clientName = safeDecode(clientNameEnc);
  admin.html:3923:            const sourceName = safeDecode(sourceNameEnc);
  admin.html:3924:            const itemsStr = decodeURIComponent(itemsEncoded);
  admin.html:3925:
  admin.html:3926:            const autoRenew = confirm(`¿Deseas REGISTRAR esta RENOVACIÓN en el sistema ahora?\n\n- 
Se extenderán 30 días adicionales.\n- Se marcará como PAGADO.\n\n(Si pulsas Cancelar, solo se enviará el mensaje de 
WhatsApp)`);
  admin.html:3927:
  admin.html:3928:            if (autoRenew) {
  admin.html:3929:                try {
  admin.html:3930:                    const cleanPhone = clientPhone.replace(/\D/g, '');
  admin.html:3931:                    // Obtenemos todos los datos para encontrar la venta correspondiente en 
sellerSales
  admin.html:3932:                    const allDataSnap = await db.ref('/').once('value');
  admin.html:3933:                    const allData = allDataSnap.val();
  admin.html:3934:                    const clientSales = allData.clientSales || {};
  admin.html:3935:                    const sellerSales = allData.sellerSales || {};
  admin.html:3936:
  admin.html:3937:                    let updates = {};
  admin.html:3938:                    
  admin.html:3939:                    // 1. Actualizar en clientSales (es directo si tenemos el saleId)
  admin.html:3940:                    if (clientSales[cleanPhone] && clientSales[cleanPhone][saleId]) {
  admin.html:3941:                        const s = clientSales[cleanPhone][saleId];
  admin.html:3942:                        const currentExp = parseInt(s.expirationDate) || Date.now();
  admin.html:3943:                        const newExp = window.DPCBillingEngine ? 
window.DPCBillingEngine.calcularProximoVencimiento(c.fechaCompraOriginal || currentExp, currentExp).getTime() : 
currentExp + (30 * 24 * 60 * 60 * 1000); // Cap Month
  admin.html:3944:                        updates[`clientSales/${cleanPhone}/${saleId}/expirationDate`] = newExp;
  admin.html:3945:                        updates[`clientSales/${cleanPhone}/${saleId}/isPaid`] = true;
  admin.html:3946:                        
  admin.html:3947:                        // 2. Buscar en sellerSales donde coincida el telefono y la fecha original
  admin.html:3948:                        for (let sName in sellerSales) {
  admin.html:3949:                            for (let sid in sellerSales[sName]) {
  admin.html:3950:                                const ss = sellerSales[sName][sid];
  admin.html:3951:                                if (ss.clientPhone === cleanPhone && ss.date === s.date) {
  admin.html:3952:                                    updates[`sellerSales/${sName}/${sid}/expirationDate`] = newExp;
  admin.html:3953:                                    updates[`sellerSales/${sName}/${sid}/isPaid`] = true;
  admin.html:3954:                                }
  admin.html:3955:                            }
  admin.html:3956:                        }
  admin.html:3957:                    } else if (sourceType === 'seller' && sellerSales[sourceName] && 
sellerSales[sourceName][saleId]) {
  admin.html:3958:                        // Si no estaba en clientSales pero es una venta de vendedor
  admin.html:3959:                        const s = sellerSales[sourceName][saleId];
  admin.html:3960:                        const currentExp = parseInt(s.expirationDate) || Date.now();
  admin.html:3961:                        const newExp = window.DPCBillingEngine ? 
window.DPCBillingEngine.calcularProximoVencimiento(c.fechaCompraOriginal || currentExp, currentExp).getTime() : 
currentExp + (30 * 24 * 60 * 60 * 1000); // Cap Month
  admin.html:3962:                        updates[`sellerSales/${sourceName}/${saleId}/expirationDate`] = newExp;
  admin.html:3963:                        updates[`sellerSales/${sourceName}/${saleId}/isPaid`] = true;
  admin.html:3964:                        
  admin.html:3965:                        // Intentar buscar en clientSales por fecha
  admin.html:3966:                        if (clientSales[cleanPhone]) {
  admin.html:3967:                            for (let cid in clientSales[cleanPhone]) {
  admin.html:3968:                                if (clientSales[cleanPhone][cid].date === s.date) {
  admin.html:3969:                                    updates[`clientSales/${cleanPhone}/${cid}/expirationDate`] = 
newExp;
  admin.html:3970:                                    updates[`clientSales/${cleanPhone}/${cid}/isPaid`] = true;
  admin.html:3971:                                }
  admin.html:3972:                            }
  admin.html:3973:                        }
  admin.html:3974:                    }
  admin.html:3975:
  admin.html:3976:                    if (Object.keys(updates).length > 0) {
  admin.html:3977:                        await db.ref('/').update(updates);
  admin.html:3978:                        alert("¡Sistema Actualizado con éxito! Fecha extendida y pago registrado.");
  admin.html:3979:                        fetchSellerSalesStats();
  admin.html:3980:                        fetchClientSalesHistory();
  admin.html:3981:                    } else {
  admin.html:3982:                        alert("No se encontró el registro para actualizar en la base de datos.");
  admin.html:3983:                    }
  admin.html:3984:                } catch (e) {
  admin.html:3985:                    console.error(e);
  admin.html:3986:                    alert("Error al actualizar sistema: " + e.message);
  admin.html:3987:                }
  admin.html:3988:            }
  admin.html:3989:
  admin.html:3990:            // Preparar y enviar mensaje
  admin.html:3991:            const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 
'nov', 'dic'];
  admin.html:3992:            let monthText = 'el próximo mes';
  admin.html:3993:            
  admin.html:3994:            let finalMsgTS = parseInt(expirationDateTS) || Date.now();
  admin.html:3995:            if (autoRenew) {
  admin.html:3996:                // Si el admin acaba de registrar la renovación, sumamos 30 días al mensaje
  admin.html:3997:                finalMsgTS += (30 * 24 * 60 * 60 * 1000);
  admin.html:3998:            }
  admin.html:3999:
  admin.html:4000:            const d = new Date(finalMsgTS);
  admin.html:4001:            monthText = `${d.getDate()} ${months[d.getMonth()]}`;
  admin.html:4002:            let msg = '';
  admin.html:4003:            if (isMultiple) {
  admin.html:4004:                const template = storeConfig.renovadaPluralTemplate || "♦️♦️♦️ ** Tus Pantallas de 
*{pantallas}* han sido Renovadas* con los mismos datos que tenga buen día que la disfrute ♦️♦️♦️ *vence {mes}*";
  admin.html:4005:                msg = template.replace(/{cliente}/g, clientName).replace(/{pantallas}/g, 
itemsStr).replace(/{mes}/g, monthText);
  admin.html:4006:            } else {
  admin.html:4007:                const template = storeConfig.renovadaSingularTemplate || "♦️♦️♦️ ** Tu Pantalla de 
*{pantallas}* ha sido Renovada* con los mismos datos que tenga buen día que la disfrute ♦️♦️♦️ *vence {mes}*";
  admin.html:4008:                msg = template.replace(/{cliente}/g, clientName).replace(/{pantallas}/g, 
itemsStr).replace(/{mes}/g, monthText);
  admin.html:4009:            }
  admin.html:4010:
  admin.html:4011:            const encodedMsg = encodeURIComponent(msg);
  admin.html:4012:            
  admin.html:4013:            // Si el cliente pertenece a un vendedor, el mensaje debe llegar al vendedor y no al 
cliente
  admin.html:4014:            const sNameOrPhone = sourceName;
  admin.html:4015:            if (sNameOrPhone && sNameOrPhone !== 'Página Web Oficial' && sNameOrPhone !== 'Admin' && 
sNameOrPhone !== clientPhone) {
  admin.html:4016:                db.ref(`sellerStores/${sNameOrPhone}/whatsapp`).once('value').then(snap => {
  admin.html:4017:                    const sWpp = snap.val();
  admin.html:4018:                    let sellerMsg = `✅ *Actualización de Renovación - Streaming DPC*\n\nHola 
*${sNameOrPhone}*, te informamos que la cuenta de tu cliente *${clientName}* (${clientPhone}) ha sido *RENOVADA* 
exitosamente.\n\n${msg}`;
  admin.html:4019:                    if (sWpp) {
  admin.html:4020:                        let sPhone = sWpp.toString().replace(/\D/g, '');
  admin.html:4021:                        if (sPhone.length === 10 && sPhone.startsWith('3')) sPhone = '57' + sPhone;
  admin.html:4022:                        window.openWhatsapp(sPhone, sellerMsg);
  admin.html:4023:                    } else {
  admin.html:4024:                        window.openWhatsapp(null, sellerMsg);
  admin.html:4025:                    }
  admin.html:4026:                });
  admin.html:4027:            } else {
  admin.html:4028:                let waPhone = clientPhone.toString().replace(/\D/g, '');
  admin.html:4029:                if (waPhone.length === 10 && waPhone.startsWith('3')) waPhone = '57' + waPhone;
  admin.html:4030:                window.open(`https://wa.me/${waPhone}?text=${encodedMsg}`, '_blank');
  admin.html:4031:            }
  admin.html:4032:        }
  admin.html:4033:
  admin.html:4034:        
  admin.html:4035:        window.sendCapMonthPolicy = function() {
  admin.html:4036:            if (!currentEditingClientPhone) return alert('Busca un cliente primero.');
  admin.html:4037:            const name = document.getElementById('edit-client-name').value.trim() || 'Cliente';
  admin.html:4038:            
  admin.html:4039:            const msg = (window.storeConfig && window.storeConfig.capMonthPolicyTemplate ? 
window.storeConfig.capMonthPolicyTemplate : `Hola *{cliente}*, 📢 *Actualización de Servicio*:\n\nHemos unificado las 
fechas de corte. *Tu día de pago ya no se moverá mes a mes*; ahora se renovará el mismo día de tu fecha de compra 
original.\n\nEn meses cortos (de 30 días o febrero), el sistema pondrá el vencimiento el último día del mes de forma 
automática y lo recuperará al mes siguiente.\n\nGracias por tu confianza.`).replace(/{cliente}/g, name);
  admin.html:4040:            
  admin.html:4041:            let waPhone = currentEditingClientPhone.toString().replace(/\D/g, '');
  admin.html:4042:            if (waPhone.length === 10 && waPhone.startsWith('3')) waPhone = '57' + waPhone;
  admin.html:4043:            window.open('https://wa.me/' + waPhone + '?text=' + encodeURIComponent(msg), '_blank');
  admin.html:4044:        };
  admin.html:4045:
  admin.html:4046:        window.openManualCRM = function() {
  admin.html:4047:            const saleKey = document.getElementById('edit-client-select-sale').value;
  admin.html:4048:            if (!saleKey || !window.currentClientSales || !window.currentClientSales[saleKey]) {
  admin.html:4049:                return alert('Por favor selecciona una venta válida primero.');
  admin.html:4050:            }
  admin.html:4051:            
  admin.html:4052:            const sale = window.currentClientSales[saleKey];
  admin.html:4053:            const phone = currentEditingClientPhone;
  admin.html:4054:            const name = document.getElementById('edit-client-name').value;
  admin.html:4055:            const startDate = sale.date ? new Date(sale.date).toLocaleDateString() : 'N/A';
  admin.html:4056:            const endDate = sale.expirationDate ? new Date(sale.expirationDate).toLocaleDateString() 
: 'N/A';
  admin.html:4057:            const pin = document.getElementById('edit-client-pin').value || '';
  admin.html:4058:            const itemsStr = sale.items ? sale.items.map(i => i.name).join(', ') : 'Pantalla';
  admin.html:4059:            const sellerName = sale.sellerName || 'Página Web Oficial';
  admin.html:4060:            
  admin.html:4061:            const fullItems = sale.items || [];
  admin.html:4062:            
  admin.html:4063:            openCRMPlatformSelector(
  admin.html:4064:                encodeURIComponent(name),
  admin.html:4065:                phone,
  admin.html:4066:                startDate,
  admin.html:4067:                endDate,
  admin.html:4068:                pin,
  admin.html:4069:                encodeURIComponent(itemsStr),
  admin.html:4070:                (sale.email || '').replace(/'/g, "\\'"),
  admin.html:4071:                (sale.password || '').replace(/'/g, "\\'"),
  admin.html:4072:                (sale.profile || '').replace(/'/g, "\\'"),
  admin.html:4073:                encodeURIComponent(JSON.stringify(fullItems)),
  admin.html:4074:                encodeURIComponent(sellerName)
  admin.html:4075:            );
  admin.html:4076:        };
  admin.html:4077:
  admin.html:4078:        let _crmTargetClient = { name: '', phone: '', start: '', end: '', pin: '', fullItems: [], 
sellerName: '' };
  admin.html:4079:        window.openCRMPlatformSelector = function(nameEnc, phone, start, end, pin, itemsEnc, email = 
'', pass = '', profile = '', fullItemsJson = '[]', sellerNameEnc = '') {
  admin.html:4080:            _crmTargetClient = { 
  admin.html:4081:                name: decodeURIComponent(nameEnc), 
  admin.html:4082:                phone: phone,
  admin.html:4083:                start: start,
  admin.html:4084:                end: end,
  admin.html:4085:                pin: pin,
  admin.html:4086:                itemsRaw: decodeURIComponent(itemsEnc || ''),
  admin.html:4087:                email: email,
  admin.html:4088:                pass: pass,
  admin.html:4089:                profile: profile,
  admin.html:4090:                fullItems: JSON.parse(decodeURIComponent(fullItemsJson)),
  admin.html:4091:                sellerName: decodeURIComponent(sellerNameEnc || '')
  admin.html:4092:            };
  admin.html:4093:            const modal = document.getElementById('crm-selector-modal');
  admin.html:4094:            const searchInput = document.getElementById('crm-platform-search');
  admin.html:4095:            if (searchInput) searchInput.value = ''; // Limpiar búsqueda previa
  admin.html:4096:
  admin.html:4097:            if (!modal) return;
  admin.html:4098:            renderCRMPlatformsList(''); // Renderizar todo inicialmente
  admin.html:4099:            modal.style.display = 'flex';
  admin.html:4100:        }
  admin.html:4101:
  admin.html:4102:        window.filterCRMPlatforms = function(val) {
  admin.html:4103:            renderCRMPlatformsList(val.toLowerCase());
  admin.html:4104:        }
  admin.html:4105:
  admin.html:4106:        window.renderCRMPlatformsList = function(filter) {
  admin.html:4107:            const list = document.getElementById('crm-platforms-selection-list');
  admin.html:4108:            if (!list) return;
  admin.html:4109:
  admin.html:4110:            list.innerHTML = '';
  admin.html:4111:            const dict = storeConfig.crmGalleryDict || {};
  admin.html:4112:            const platforms = storeConfig.crmPlatforms || {};
  admin.html:4113:            let allKeys = Object.keys(platforms);
  admin.html:4114:            if (allKeys.length === 0) allKeys = Object.keys(dict);
  admin.html:4115:            
  admin.html:4116:            const purchasedItemsStr = (_crmTargetClient.itemsRaw || '').toLowerCase();
  admin.html:4117:            
  admin.html:4118:            // Separar en recomendados y resto
  admin.html:4119:            const keys = allKeys.filter(k => k.toLowerCase().includes(filter));
  admin.html:4120:            
  admin.html:4121:            const recommended = [];
  admin.html:4122:            const others = [];
  admin.html:4123:
  admin.html:4124:            keys.forEach(k => {
  admin.html:4125:                const kLower = k.toLowerCase();
  admin.html:4126:                // Ver si la clave está mencionada en lo que compró el cliente (ej: "Netflix" en 
"Combo: Netflix + Disney")
  admin.html:4127:                if (purchasedItemsStr.includes(kLower)) {
  admin.html:4128:                    recommended.push(k);
  admin.html:4129:                } else {
  admin.html:4130:                    others.push(k);
  admin.html:4131:                }
  admin.html:4132:            });
  admin.html:4133:
  admin.html:4134:            if (keys.length === 0) {
  admin.html:4135:                list.innerHTML = `<p style="color:#777; grid-column: 1 / -1; text-align:center; 
padding:20px;">No se encontraron categorías.</p>`;
  admin.html:4136:                return;
  admin.html:4137:            }
  admin.html:4138:
  admin.html:4139:            // Pintar Recomendados primero
  admin.html:4140:            if (recommended.length > 0 && !filter) {
  admin.html:4141:                const title = document.createElement('p');
  admin.html:4142:                title.style = 'grid-column: 1 / -1; color: var(--accent-primary); font-weight: bold; 
margin: 10px 0 5px 0; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;';
  admin.html:4143:                title.innerHTML = '<i class="fa-solid fa-star"></i> Detectados en esta venta:';
  admin.html:4144:                list.appendChild(title);
  admin.html:4145:                recommended.forEach(k => list.appendChild(createPlatformButton(k, true)));
  admin.html:4146:                
  admin.html:4147:                const titleRest = document.createElement('p');
  admin.html:4148:                titleRest.style = 'grid-column: 1 / -1; color: #777; font-weight: bold; margin: 20px 
0 5px 0; font-size: 0.8rem; text-transform: uppercase;';
  admin.html:4149:                titleRest.innerHTML = 'Resto de plataformas:';
  admin.html:4150:                list.appendChild(titleRest);
  admin.html:4151:            }
  admin.html:4152:
  admin.html:4153:            others.forEach(k => list.appendChild(createPlatformButton(k, false)));
  admin.html:4154:        }
  admin.html:4155:
  admin.html:4156:        function createPlatformButton(k, isRecommended) {
  admin.html:4157:            const btn = document.createElement('button');
  admin.html:4158:            btn.className = 'save-btn';
  admin.html:4159:            btn.style = `margin:0; background:${isRecommended ? 'rgba(155, 89, 182, 0.15)' : 
'rgba(255,255,255,0.05)'}; border: 1px solid ${isRecommended ? '#9b59b6' : 'rgba(255,255,255,0.1)'}; font-size:0.9rem; 
padding:15px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:5px; height:auto; 
transition: all 0.2; min-height:100px; justify-content:center; position:relative; overflow:hidden;`;
  admin.html:4160:            btn.id = 'btn-crm-' + k.replace(/\s+/g, '-');
  admin.html:4161:            
  admin.html:4162:            let displayName = k;
  admin.html:4163:            let displayVariant = '';
  admin.html:4164:            if (k.includes(' | ')) {
  admin.html:4165:                const parts = k.split(' | ');
  admin.html:4166:                displayName = parts[0];
  admin.html:4167:                displayVariant = parts[1];
  admin.html:4168:            }
  admin.html:4169:
  admin.html:4170:            btn.innerHTML = `
  admin.html:4171:                <i class="fa-solid fa-tv" style="color:${isRecommended ? '#9b59b6' : 
'var(--accent-primary)'}; font-size:1.2rem;"></i> 
  admin.html:4172:                <span style="word-break: break-word; font-weight:bold;">${displayName}</span>
  admin.html:4173:                ${displayVariant ? `<span style="font-size:0.7rem; color:#2ab7ca; 
background:rgba(42,183,202,0.1); padding:2px 6px; border-radius:4px; margin-top:3px;">${displayVariant}</span>` : ''}
  admin.html:4174:            `;
  admin.html:4175:            
  admin.html:4176:            btn.onclick = () => {
  admin.html:4177:                sendCRMStep1Message(k);
  admin.html:4178:                btn.style.opacity = '0.5';
  admin.html:4179:                btn.style.filter = 'grayscale(1)';
  admin.html:4180:                btn.innerHTML += '<br><small style="color:#2ecc71; 
font-size:0.7rem;">¡Enviado!</small>';
  admin.html:4181:                btn.disabled = true;
  admin.html:4182:            };
  admin.html:4183:
  admin.html:4184:            btn.onmouseover = () => { 
  admin.html:4185:                if (!btn.disabled) {
  admin.html:4186:                    btn.style.background='var(--accent-primary)'; btn.style.color='black'; 
btn.querySelector('i').style.color='black'; 
  admin.html:4187:                }
  admin.html:4188:            };
  admin.html:4189:            btn.onmouseout = () => { 
  admin.html:4190:                if (!btn.disabled) {
  admin.html:4191:                    btn.style.background=isRecommended ? 'rgba(155, 89, 182, 0.15)' : 
'rgba(255,255,255,0.05)'; 
  admin.html:4192:                    btn.style.color='white'; 
  admin.html:4193:                    btn.querySelector('i').style.color=isRecommended ? '#9b59b6' : 
'var(--accent-primary)'; 
  admin.html:4194:                }
  admin.html:4195:            };
  admin.html:4196:            return btn;
  admin.html:4197:        }
  admin.html:4198:
  admin.html:4199:        window.closeCRMSelector = function() {
  admin.html:4200:            document.getElementById('crm-selector-modal').style.display = 'none';
  admin.html:4201:        }
  admin.html:4202:
  admin.html:4203:        function replaceCRMVars(text, data) {
  admin.html:4204:            if (!text) return "";
  admin.html:4205:            return text
  admin.html:4206:                .replace(/{cliente}/ig, data.name || '')
  admin.html:4207:                .replace(/{nombre}/ig, data.name || '')
  admin.html:4208:                .replace(/{pantalla}/ig, data.platformName || '')
  admin.html:4209:                .replace(/{inicio}/ig, data.start || '')
  admin.html:4210:                .replace(/{Fin}/ig, data.end || '')
  admin.html:4211:                .replace(/{pin}/ig, data.pin || 'N/A')
  admin.html:4212:                .replace(/{correo}/ig, data.email || 'N/A')
  admin.html:4213:                .replace(/{clave}/ig, data.pass || 'N/A')
  admin.html:4214:                .replace(/{perfil}/ig, data.profile || 'N/A');
  admin.html:4215:        }
  admin.html:4216:
  admin.html:4217:        window.sendCRMStep1Message = function(platformName) {
  admin.html:4218:            const { name, phone, start, end, pin, sellerName } = _crmTargetClient;
  admin.html:4219:            const dict = storeConfig.crmGalleryDict || {};
  admin.html:4220:            const items = dict[platformName] || [];
  admin.html:4221:
  admin.html:4222:            // ── Leer useLocalRobotCRM SIEMPRE desde storeConfig (fuente de verdad = Firebase)
  admin.html:4223:            // También sincronizar desde el DOM si el elemento existe
  admin.html:4224:            const robotSelect = document.getElementById('conf-useLocalRobotCRM');
  admin.html:4225:            if (robotSelect) {
  admin.html:4226:                storeConfig.useLocalRobotCRM = robotSelect.value === 'true';
  admin.html:4227:            }
  admin.html:4228:            const useRobot = storeConfig.useLocalRobotCRM === true;
  admin.html:4229:
  admin.html:4230:            let targetEmail = _crmTargetClient.email && _crmTargetClient.email.trim() ? 
_crmTargetClient.email : 'N/A';
  admin.html:4231:            
  admin.html:4232:            // Buscar email específico para esta plataforma en los items de la venta
  admin.html:4233:            const fullItemsRaw = _crmTargetClient.fullItems || [];
  admin.html:4234:            const fullItems = Array.isArray(fullItemsRaw) ? fullItemsRaw : 
Object.values(fullItemsRaw || {});
  admin.html:4235:            
  admin.html:4236:            if (fullItems.length > 0) {
  admin.html:4237:                fullItems.forEach(it => {
  admin.html:4238:                    if (it.specificEmails && Array.isArray(it.specificEmails)) {
  admin.html:4239:                        const match = it.specificEmails.find(se => 
  admin.html:4240:                            se.platform && (
  admin.html:4241:                            se.platform.toLowerCase() === platformName.toLowerCase() || 
  admin.html:4242:                            platformName.toLowerCase().includes(se.platform.toLowerCase()) ||
  admin.html:4243:                            se.platform.toLowerCase().includes(platformName.toLowerCase())
  admin.html:4244:                            )
  admin.html:4245:                        );
  admin.html:4246:                        if (match && match.email && match.email.trim()) targetEmail = match.email;
  admin.html:4247:                    }
  admin.html:4248:                });
  admin.html:4249:            }
  admin.html:4250:
  admin.html:4251:            const dataVars = {
  admin.html:4252:                name, platformName, start, end, pin,
  admin.html:4253:                email: targetEmail,
  admin.html:4254:                pass: _crmTargetClient.pass,
  admin.html:4255:                profile: _crmTargetClient.profile
  admin.html:4256:            };
  admin.html:4257:
  admin.html:4258:            let template = storeConfig.msgTemplate1 || "¡Hola {cliente}! Aquí tienes los datos de tu 
pantalla de {pantalla}:";
  admin.html:4259:            let mainText = replaceCRMVars(template, dataVars);
  admin.html:4260:            
  admin.html:4261:            let allLocalPhotos = [];
  admin.html:4262:            let extraText = "";
  admin.html:4263:
  admin.html:4264:            // Añadir fotos y sus textos
  admin.html:4265:            if (items.length > 0) {
  admin.html:4266:                extraText += "\n\n🚀 *DETALLES Y GUÍA:*";
  admin.html:4267:                items.forEach((item, index) => {
  admin.html:4268:                    let itemText = replaceCRMVars(item.text, dataVars);
  admin.html:4269:                    if (itemText) extraText += `\n\n📌 *Paso ${index+1}:* ${itemText}`;
  admin.html:4270:                    
  admin.html:4271:                    if (item.photo) {
  admin.html:4272:                        const urls = item.photo.split(/[,,;]/).map(u => u.trim()).filter(u => u);
  admin.html:4273:                        if (useRobot) {
  admin.html:4274:                            urls.forEach(url => allLocalPhotos.push(url));
  admin.html:4275:                        } else {
  admin.html:4276:                            urls.forEach(url => extraText += `\n🔗 Foto guía: ${url}`);
  admin.html:4277:                        }
  admin.html:4278:                    }
  admin.html:4279:                });
  admin.html:4280:            }
  admin.html:4281:
  admin.html:4282:            const fullMsgForClient = mainText + extraText;
  admin.html:4283:
  admin.html:4284:            let targetWhatsAppStr = phone;
  admin.html:4285:            let isTargetingSeller = false;
  admin.html:4286:
  admin.html:4287:            if (sellerName && sellerName !== 'Página Web Oficial' && storeConfig.sellers) {
  admin.html:4288:                const sellerInfo = storeConfig.sellers.find(s => s.name === sellerName);
  admin.html:4289:                if (sellerInfo && sellerInfo.whatsapp) {
  admin.html:4290:                    if (confirm(`📦 Esta venta pertenece al vendedor "${sellerName}".\n\n¿Deseas 
enviar el CRM al VENDEDOR para que él se lo entregue a su cliente?\n\n- Aceptar (OK) = Enviar al Vendedor\n- Cancelar 
= Enviar directo al Cliente`)) {
  admin.html:4291:                        targetWhatsAppStr = sellerInfo.whatsapp;
  admin.html:4292:                        isTargetingSeller = true;
  admin.html:4293:                    }
  admin.html:4294:                }
  admin.html:4295:            }
  admin.html:4296:
  admin.html:4297:            if (useRobot) {
  admin.html:4298:                // ── MODO ROBOT LOCAL: Envía CMD_CRM@@@ a TU número de WhatsApp ──
  admin.html:4299:                const adminPhone = storeConfig.whatsappNumber || '';
  admin.html:4300:                if (!adminPhone) return alert('⚠️ Debes configurar tu número de WhatsApp en la 
pestaña Configuración → Generales.');
  admin.html:4301:                
  admin.html:4302:                let cleanAdmin = adminPhone.toString().replace(/\D/g, '');
  admin.html:4303:                if (cleanAdmin.length === 10 && cleanAdmin.startsWith('3')) cleanAdmin = '57' + 
cleanAdmin;
  admin.html:4304:
  admin.html:4305:                // Formato del comando que el Robot debe captar
  admin.html:4306:                const command = 
`CMD_CRM@@@TEL:${targetWhatsAppStr}@@@TX:${fullMsgForClient}@@@IMG:${allLocalPhotos.join(',')}` ;
  admin.html:4307:                
  admin.html:4308:                if (confirm(`🤖 MODO ROBOT ACTIVO\n\nSe enviará el comando CRM a TU número 
(${cleanAdmin}) para que tu Robot lo procese y reenvíe ${isTargetingSeller ? 'al VENDEDOR' : 'al 
CLIENTE'}.\n\n¿Continuar?`)) {
  admin.html:4309:                    window.openWhatsapp(cleanAdmin, command);
  admin.html:4310:                }
  admin.html:4311:            } else {
  admin.html:4312:                // ── MODO DIRECTO: Abre WhatsApp Web al número del cliente ──
  admin.html:4313:                const encodedMsg = encodeURIComponent(fullMsgForClient);
  admin.html:4314:                let waPhone = targetWhatsAppStr.toString().replace(/\D/g, '');
  admin.html:4315:                if (waPhone.length === 10 && waPhone.startsWith('3')) waPhone = '57' + waPhone;
  admin.html:4316:                window.open(`https://wa.me/${waPhone}?text=${encodedMsg}`, '_blank');
  admin.html:4317:            }
  admin.html:4318:        }
  admin.html:4319:
  admin.html:4320:        async function sendAdminReminderToSeller(sellerNameEnc, clientNameEnc, itemsEncoded, 
clientPhone, saleTotal) {
  admin.html:4321:            const sellerName = safeDecode(sellerNameEnc);
  admin.html:4322:            const clientName = safeDecode(clientNameEnc);
  admin.html:4323:            const itemsStr = safeDecode(itemsEncoded);
  admin.html:4324:            
  admin.html:4325:            let clientPin = "No asignado";
  admin.html:4326:            if (clientPhone) {
  admin.html:4327:                let cleanPhone = clientPhone.replace(/\D/g, '');
  admin.html:4328:                try {
  admin.html:4329:                    const snap = await db.ref(`clientProfiles/${cleanPhone}/pin`).once('value');
  admin.html:4330:                    if (snap.exists() && snap.val()) {
  admin.html:4331:                        clientPin = snap.val();
  admin.html:4332:                    }
  admin.html:4333:                } catch(e) {}
  admin.html:4334:            }
  admin.html:4335:
  admin.html:4336:            let template = storeConfig.sellerReminderTemplate || "Hola *{vendedor}* 👋\n\nTe 
recuerdo que la cuenta de tu cliente *{cliente}* (📱 {celular})\n\nCon: {pantallas}\n👉 *FINALIZA PRONTO o YA VENCIÓ* 
👈\n\nPor favor contáctalo para gestionar su renovación.\n\nCelular: {celular} y Pin: {pin}\n💰 *Total:* ${total}";
  admin.html:4337:            
  admin.html:4338:            let finalMsg = template
  admin.html:4339:                .replace(/{vendedor}/g, sellerName)
  admin.html:4340:                .replace(/{cliente}/g, clientName)
  admin.html:4341:                .replace(/{pantallas}/g, itemsStr)
  admin.html:4342:                .replace(/{celular}/g, clientPhone || 'N/A')
  admin.html:4343:                .replace(/{pin}/g, clientPin)
  admin.html:4344:                .replace(/{total}/g, (saleTotal || 0).toLocaleString())
  admin.html:4345:                .replace(/{pago}/g, storeConfig.paymentInfo || '');
  admin.html:4346:
  admin.html:4347:            const encodedMsg = encodeURIComponent(finalMsg);
  admin.html:4348:            
  admin.html:4349:            // BUSCAR WHATSAPP DEL VENDEDOR
  admin.html:4350:            try {
  admin.html:4351:                const snapS = await db.ref(`sellerStores/${sellerName}/whatsapp`).once('value');
  admin.html:4352:                const sWpp = snapS.val();
  admin.html:4353:                let sellerWa = "";
  admin.html:4354:                if (sWpp) {
  admin.html:4355:                    sellerWa = sWpp.toString().replace(/\D/g, '');
  admin.html:4356:                    if (sellerWa.length === 10 && sellerWa.startsWith('3')) sellerWa = '57' + 
sellerWa;
  admin.html:4357:                }
  admin.html:4358:                window.open(`https://wa.me/${sellerWa}?text=${encodedMsg}`, '_blank');
  admin.html:4359:            } catch(e) {
  admin.html:4360:                window.open(`https://wa.me/?text=${encodedMsg}`, '_blank');
  admin.html:4361:            }
  admin.html:4362:        }
  admin.html:4363:
  admin.html:4364:        function redeemSellerBonuses(sellerName, maxAmount) {
  admin.html:4365:            if (maxAmount <= 0) return alert('Este vendedor no tiene saldo activo para canjear en 
este momento.');
  admin.html:4366:
  admin.html:4367:            const p = prompt(`Saldo Activo de ${sellerName}: 
$${maxAmount.toLocaleString()}\n\n¿Cuánto dinero deseas "CANJEAR" (restar) de su saldo?\nEscribe solo números, sin 
puntos ni comas.`);
  admin.html:4368:            if (!p) return;
  admin.html:4369:
  admin.html:4370:            const deduct = parseInt(p.trim());
  admin.html:4371:            if (isNaN(deduct) || deduct <= 0) return alert('Ingresa un valor numérico válido.');
  admin.html:4372:            if (deduct > maxAmount) return alert('No puedes canjear más dinero del saldo que tiene 
disponible el vendedor.');
  admin.html:4373:
  admin.html:4374:            let sellersRaw = storeConfig.sellers || [];
  admin.html:4375:            storeConfig.sellers = Array.isArray(sellersRaw) ? sellersRaw : Object.values(sellersRaw);
  admin.html:4376:            const selIndex = storeConfig.sellers.findIndex(s => s.name === sellerName);
  admin.html:4377:            if (selIndex === -1) return alert('Vendedor no encontrado.');
  admin.html:4378:
  admin.html:4379:            let curRedeemed = storeConfig.sellers[selIndex].bonusesRedeemed ? 
parseInt(storeConfig.sellers[selIndex].bonusesRedeemed) : 0;
  admin.html:4380:            storeConfig.sellers[selIndex].bonusesRedeemed = curRedeemed + deduct;
  admin.html:4381:
  admin.html:4382:            db.ref('storeConfig').set(storeConfig).then(() => {
  admin.html:4383:                alert(`Has canjeado exitosamente $${deduct.toLocaleString()} del saldo de 
${sellerName}.`);
  admin.html:4384:                fetchSellerSalesStats();
  admin.html:4385:            });
  admin.html:4386:        }
  admin.html:4387:
  admin.html:4388:        // --- SECTION CLIENTS ---
  admin.html:4389:        let currentEditingClientPhone = null;
  admin.html:4390:
  admin.html:4391:        function renderBlockedClients() {
  admin.html:4392:            const listDiv = document.getElementById('admin-list-blocked');
  admin.html:4393:            listDiv.innerHTML = '';
  admin.html:4394:            const blocked = storeConfig.blockedClients || [];
  admin.html:4395:
  admin.html:4396:            if (blocked.length === 0) {
  admin.html:4397:                listDiv.innerHTML = '<p style="color:#a0a0a0; padding:1rem;">Nadie está bloqueado 
actualmente.</p>';
  admin.html:4398:            }
  admin.html:4399:
  admin.html:4400:            blocked.forEach((phone, index) => {
  admin.html:4401:                const div = document.createElement('div');
  admin.html:4402:                div.className = 'admin-item';
  admin.html:4403:                div.innerHTML = `
  admin.html:4404:                    <div><i class="fa-solid fa-ban" style="color:#ff4d4d; 
font-size:1.5rem"></i></div>
  admin.html:4405:                    <div>
  admin.html:4406:                        <strong style="color: white; font-size:1.1rem">${phone}</strong>
  admin.html:4407:                    </div>
  admin.html:4408:                    <div class="item-actions">
  admin.html:4409:                        <button class="btn-icon" style="color:#4cd137;" 
onclick="unblockClient(${index})" title="Desbloquear Cliente">
  admin.html:4410:                            Desbloquear
  admin.html:4411:                        </button>
  admin.html:4412:                    </div>
  admin.html:4413:                `;
  admin.html:4414:                listDiv.appendChild(div);
  admin.html:4415:            });
  admin.html:4416:        }
  admin.html:4417:
  admin.html:4418:        let allClientProfiles = {};
  admin.html:4419:        function fetchClientSalesHistory() {
  admin.html:4420:            renderAllClientsList();
  admin.html:4421:        }
  admin.html:4422:
  admin.html:4423:        function exportClientsCSV() {
  admin.html:4424:            db.ref('clientProfiles').once('value').then(snap => {
  admin.html:4425:                const profiles = snap.val() || {};
  admin.html:4426:                let csv = "Telefono,Nombre,PIN\n";
  admin.html:4427:                Object.keys(profiles).forEach(phone => {
  admin.html:4428:                    csv += `${phone},${profiles[phone].name || ''},${profiles[phone].pin || ''}\n`;
  admin.html:4429:                });
  admin.html:4430:
  admin.html:4431:                const blob = new Blob([csv], { type: 'text/csv' });
  admin.html:4432:                const url = window.URL.createObjectURL(blob);
  admin.html:4433:                const a = document.createElement('a');
  admin.html:4434:                a.href = url;
  admin.html:4435:                a.download = 'clientes.csv';
  admin.html:4436:                a.click();
  admin.html:4437:            });
  admin.html:4438:        }
  admin.html:4439:
  admin.html:4440:        async function importClientsCSV() {
  admin.html:4441:            const csvText = document.getElementById('import-clients-csv').value.trim();
  admin.html:4442:            if (!csvText) return alert('Pega el texto CSV primero.');
  admin.html:4443:
  admin.html:4444:            const lines = csvText.split('\n');
  admin.html:4445:            let updates = {};
  admin.html:4446:            let count = 0;
  admin.html:4447:
  admin.html:4448:            for (let line of lines) {
  admin.html:4449:                if (line.includes('Telefono,Nombre,PIN')) continue; // Skip header
  admin.html:4450:                const parts = line.split(',');
  admin.html:4451:                if (parts.length >= 2) {
  admin.html:4452:                    let phone = parts[0].trim().replace(/\D/g, '');
  admin.html:4453:                    let name = parts[1].trim();
  admin.html:4454:                    let pin = (parts[2] || '').trim();
  admin.html:4455:                    if (phone.length >= 5) { // validish phone
  admin.html:4456:                        updates[`clientProfiles/${phone}/name`] = name;
  admin.html:4457:                        if (pin) updates[`clientProfiles/${phone}/pin`] = pin;
  admin.html:4458:                        count++;
  admin.html:4459:                    }
  admin.html:4460:                }
  admin.html:4461:            }
  admin.html:4462:
  admin.html:4463:            if (count > 0 && confirm(`¿Subir ${count} clientes a la base de datos?`)) {
  admin.html:4464:                try {
  admin.html:4465:                    await db.ref().update(updates);
  admin.html:4466:                    alert('¡Clientes importados exitosamente!');
  admin.html:4467:                    document.getElementById('import-clients-csv').value = '';
  admin.html:4468:                } catch (e) {
  admin.html:4469:                    console.error(e);
  admin.html:4470:                    alert('Error subiendo base de datos.');
  admin.html:4471:                }
  admin.html:4472:            } else if (count === 0) {
  admin.html:4473:                alert('No se detectaron filas válidas. Revisa el formato.');
  admin.html:4474:            }
  admin.html:4475:        }
  admin.html:4476:
  admin.html:4477:        function renderAdminSaleCard(sale, isExpired, clientObj, container) {
  admin.html:4478:            const now = Date.now();
  admin.html:4479:            const expEndOfDay = sale.expirationDate;
  admin.html:4480:            const daysLeft = Math.ceil((expEndOfDay - now) / (1000 * 60 * 60 * 24));
  admin.html:4481:
  admin.html:4482:            let statusColor = '#4cd137';
  admin.html:4483:            if (!isExpired && daysLeft <= 3) statusColor = '#f39c12';
  admin.html:4484:            if (isExpired) statusColor = '#ff4d4d';
  admin.html:4485:
  admin.html:4486:            let itemsRaw = sale.items || [];
  admin.html:4487:            const items = Array.isArray(itemsRaw) ? itemsRaw : Object.values(itemsRaw || {});
  admin.html:4488:
  admin.html:4489:            const itemsStr = items.map(i => {
  admin.html:4490:                let formatName = i.name;
  admin.html:4491:                if (i.category && i.category.startsWith('combos')) formatName = `🎬 * ${i.name}* 
(Combo Prediseñado)`;
  admin.html:4492:                return formatName;
  admin.html:4493:            }).join(', ') || 'Pantallas';
  admin.html:4494:            const safeClientName = safeDecode(clientObj.name || '').replace(/'/g, '');
  admin.html:4495:            const totalDisp = sale.total ? `$${sale.total.toLocaleString()} ` : 'No registrado';
  admin.html:4496:
  admin.html:4497:            const startDate = sale.date ? new Date(sale.date).toLocaleDateString() : 'N/A';
  admin.html:4498:            const endDate = sale.expirationDate ? new Date(sale.expirationDate).toLocaleDateString() 
: 'N/A';
  admin.html:4499:
  admin.html:4500:            const saleCard = document.createElement('div');
  admin.html:4501:            saleCard.style.padding = '1rem';
  admin.html:4502:            saleCard.style.background = isExpired ? 'rgba(255,255,255,0.02)' : 
'rgba(255,255,255,0.05)';
  admin.html:4503:            saleCard.style.borderLeft = `4px solid ${statusColor}`;
  admin.html:4504:            saleCard.style.borderRadius = '8px';
  admin.html:4505:            saleCard.style.opacity = isExpired ? '0.7' : '1';
  admin.html:4506:
  admin.html:4507:            const isSellerSale = sale.sellerName && sale.sellerName !== 'Página Web Oficial';
  admin.html:4508:            let reminderOnclick = '';
  admin.html:4509:            if (isSellerSale) {
  admin.html:4510:                reminderOnclick = 
`sendAdminReminderToSeller('${encodeURIComponent(sale.sellerName)}', '${encodeURIComponent(safeClientName)}', 
'${encodeURIComponent(itemsStr)}', '${clientObj.phone}', ${sale.total || 0})`;
  admin.html:4511:            } else {
  admin.html:4512:                reminderOnclick = 
`sendAdminReminderToDirectClient('${encodeURIComponent(safeClientName)}', '${encodeURIComponent(itemsStr)}', 
'${clientObj.phone}', ${sale.total || 0})`;
  admin.html:4513:            }
  admin.html:4514:
  admin.html:4515:            let buttonsHtml = `
  admin.html:4516:                <div style="display:flex; gap:0.5rem; flex-wrap: wrap;">
  admin.html:4517:                    <button onclick="${reminderOnclick}" 
  admin.html:4518:                        style="flex:1; padding:0.6rem 0.5rem; border-radius:8px; cursor:pointer; 
font-weight:bold; border:1px solid #2ab7ca; background: rgba(42, 183, 202, 0.1); color:#2ab7ca; font-size:0.8rem; 
min-width: 100px;">
  admin.html:4519:                        <i class="fa-brands fa-whatsapp"></i> ${isSellerSale ? 'Avisar Vendedor' : 
'Recordar'}
  admin.html:4520:                    </button>
  admin.html:4521:                    <button 
onclick="sendAdminRenovadaMessage('${encodeURIComponent(clientObj.name)}', '${clientObj.phone}', 
'${encodeURIComponent(itemsStr)}', ${(sale.items && sale.items.length > 1) ? true : false}, ${sale.expirationDate || 
0}, '${sale.id}', '${encodeURIComponent(sale.sellerName || 'Página Web Oficial')}', 'client')" 
  admin.html:4522:                        style="flex:1; padding:0.6rem 0.5rem; border-radius:8px; cursor:pointer; 
font-weight:bold; border:1px solid #f39c12; background: rgba(243, 156, 18, 0.1); color:#f39c12; font-size:0.8rem; 
min-width: 100px;">
  admin.html:4523:                        <i class="fa-brands fa-whatsapp"></i> Renovada
  admin.html:4524:                    </button>
  admin.html:4525:                    ${storeConfig.crmEnabled !== false ? `
  admin.html:4526:                    <button 
onclick="openCRMPlatformSelector('${encodeURIComponent(clientObj.name)}', '${clientObj.phone}', '${startDate}', 
'${endDate}', '${(allClientProfiles[clientObj.phone] ? allClientProfiles[clientObj.phone].pin : '')}', 
'${encodeURIComponent(itemsStr)}', '${(sale.email || '').replace(/'/g, "\\'")}', '${(sale.password || 
'').replace(/'/g, "\\'")}', '${(sale.profile || '').replace(/'/g, "\\'")}', 
'${encodeURIComponent(JSON.stringify(sale.items || []))}', '${encodeURIComponent(sale.sellerName || 'Página Web 
Oficial')}')" 
  admin.html:4527:                        style="flex:1; padding:0.6rem 0.5rem; border-radius:8px; cursor:pointer; 
font-weight:bold; border:1px solid #9b59b6; background: rgba(155, 89, 182, 0.1); color:#9b59b6; font-size:0.8rem; 
min-width: 100px;">
  admin.html:4528:                        <i class="fa-solid fa-comment-dots"></i> RESPUESTAS
  admin.html:4529:                    </button>
  admin.html:4530:                    ` : ''}
  admin.html:4531:                    <button onclick="deleteClientSale('${clientObj.phone}', '${sale.id}')" 
  admin.html:4532:                        style="padding:0.6rem 0.6rem; border-radius:8px; cursor:pointer; 
font-weight:bold; border:1px solid #ff4d4d; background: transparent; color:#ff4d4d; font-size:0.8rem;">
  admin.html:4533:                        <i class="fa-solid fa-trash"></i>
  admin.html:4534:                    </button>
  admin.html:4535:                </div>
  admin.html:4536:            `;
  admin.html:4537:
  admin.html:4538:            saleCard.innerHTML = `
  admin.html:4539:                <div style="display:flex; justify-content:space-between; margin-bottom: 0.3rem;">
  admin.html:4540:                    <span style="font-size: 0.85rem; color:#ccc; display:flex; align-items:center; 
gap:8px;">
  admin.html:4541:                        <input type="checkbox" class="client-sale-checkbox" 
value="${clientObj.phone}|${sale.id}" style="cursor:pointer; width:16px; height:16px;">
  admin.html:4542:                        ${new Date(sale.date).toLocaleDateString()}
  admin.html:4543:                    </span>
  admin.html:4544:                    <span style="background:${statusColor}; color:white; padding: 2px 6px; 
border-radius: 6px; font-size: 0.75rem; font-weight:bold; margin-left: auto;">
  admin.html:4545:                        ${!isExpired ? `Vence en ${daysLeft} días` : 'Vencida'}
  admin.html:4546:                    </span>
  admin.html:4547:                </div>
  admin.html:4548:                ${!isExpired ? `
  admin.html:4549:                <div style="margin-bottom:0.5rem; display:flex;">
  admin.html:4550:                    <button onclick="toggleSaleStatus('client', '${clientObj.phone}', '${sale.id}', 
${sale.isPaid === false ? 'true' : 'false'}, '${clientObj.phone}')" 
  admin.html:4551:                        style="padding:0.4rem 0.6rem; border-radius:8px; cursor:pointer; 
font-weight:bold; border:1px solid ${sale.isPaid === false ? '#f39c12' : '#4cd137'}; background: transparent; 
color:${sale.isPaid === false ? '#f39c12' : '#4cd137'}; font-size:0.75rem;">
  admin.html:4552:                        <i class="fa-solid ${sale.isPaid === false ? 'fa-square' : 
'fa-check-square'}"></i> ${sale.isPaid === false ? 'Pago Pendiente' : 'Pagado'}
  admin.html:4553:                    </button>
  admin.html:4554:                </div>
  admin.html:4555:                ` : ''}
  admin.html:4556:                <p style="font-size:0.8rem; color:var(--text-primary); margin-bottom:${isExpired ? 
'0' : '0.8rem'}; line-height:1.4;">
  admin.html:4557:                    📺 ${itemsStr}<br>
  admin.html:4558:                    💰 Valor: ${totalDisp}<br>
  admin.html:4559:                    📅 Inicio: ${startDate} | ⏳ Fin: ${endDate}
  admin.html:4560:                </p>
  admin.html:4561:                ${buttonsHtml}
  admin.html:4562:            `;
  admin.html:4563:            container.appendChild(saleCard);
  admin.html:4564:        }
  admin.html:4565:
  admin.html:4566:        function renderAllClientsList() {
  admin.html:4567:            try {
  admin.html:4568:                const listDiv = document.getElementById('admin-list-all-clients');
  admin.html:4569:                if (!listDiv) return;
  admin.html:4570:
  admin.html:4571:                const filterInput = document.getElementById('filter-clients-text');
  admin.html:4572:                const filterText = (filterInput ? filterInput.value : '').toLowerCase();
  admin.html:4573:                listDiv.innerHTML = '';
  admin.html:4574:
  admin.html:4575:            const phones = Object.keys(allClientSalesMap);
  admin.html:4576:            if (phones.length === 0) {
  admin.html:4577:                listDiv.innerHTML = '<p style="color:#ccc;">No hay clientes registrados en el 
historial.</p>';
  admin.html:4578:                return;
  admin.html:4579:            }
  admin.html:4580:
  admin.html:4581:            const clientsData = phones.map(phone => {
  admin.html:4582:                const sales = allClientSalesMap[phone] || {};
  admin.html:4583:                const salesArray = Array.isArray(sales) ? sales : Object.values(sales);
  admin.html:4584:                
  admin.html:4585:                // Count valid sales only
  admin.html:4586:                let validCount = 0;
  admin.html:4587:                salesArray.forEach(s => {
  admin.html:4588:                    if (!s) return;
  admin.html:4589:                    if (s.isPaid !== false) validCount++;
  admin.html:4590:                });
  admin.html:4591:
  admin.html:4592:                const sortedSales = salesArray.sort((a, b) => (b.date || 0) - (a.date || 0));
  admin.html:4593:                const latestSale = sortedSales[0] || {};
  admin.html:4594:                
  admin.html:4595:                return { 
  admin.html:4596:                    phone, 
  admin.html:4597:                    name: safeDecode(latestSale.clientName || 'Desconocido'), 
  admin.html:4598:                    city: safeDecode(latestSale.clientCity || 'N/A'), 
  admin.html:4599:                    count: validCount 
  admin.html:4600:                };
  admin.html:4601:            });
  admin.html:4602:
  admin.html:4603:            clientsData.filter(c => (c.phone || '').includes(filterText) || (c.name || 
'').toLowerCase().includes(filterText)).forEach(c => {
  admin.html:4604:                try {
  admin.html:4605:                    const phone = c.phone;
  admin.html:4606:                const sales = allClientSalesMap[phone] || {};
  admin.html:4607:                const salesArray = Object.keys(sales).map(k => ({ id: k, ...sales[k] })).sort((a, b) 
=> b.date - a.date);
  admin.html:4608:
  admin.html:4609:                const div = document.createElement('div');
  admin.html:4610:                div.className = 'admin-item';
  admin.html:4611:                div.style.flexDirection = 'column';
  admin.html:4612:                div.style.alignItems = 'flex-start';
  admin.html:4613:                div.style.gap = '1rem';
  admin.html:4614:
  admin.html:4615:                div.innerHTML = `
  admin.html:4616:                        <div style="display:flex; gap:1rem; width:100%; align-items:center;">
  admin.html:4617:                        <div><i class="fa-solid fa-user" style="color:#2ab7ca; 
font-size:1.5rem"></i></div>
  admin.html:4618:                        <div style="flex:1;">
  admin.html:4619:                            <strong style="color: white; 
font-size:1.1rem">${safeDecode(c.name)}</strong> <span style="font-size:0.8rem; color:#ccc;">(${c.count} 
compras)</span><br>
  admin.html:4620:                            <span style="font-size: 0.8rem; color: #a0a0a0;">📱 ${c.phone} | 📍 
${c.city}</span>
  admin.html:4621:                        </div>
  admin.html:4622:                        <div class="item-actions">
  admin.html:4623:                            <button class="btn-icon btn-edit" 
onclick="clickEditClient('${c.phone}')" title="Editar Cliente">
  admin.html:4624:                                <i class="fa-solid fa-pen"></i>
  admin.html:4625:                            </button>
  admin.html:4626:                        </div>
  admin.html:4627:                    </div>
  admin.html:4628:                `;
  admin.html:4629:
  admin.html:4630:                if (salesArray.length > 0) {
  admin.html:4631:                    const salesContainer = document.createElement('div');
  admin.html:4632:                    salesContainer.style.width = '100%';
  admin.html:4633:                    salesContainer.style.display = 'grid';
  admin.html:4634:                    salesContainer.style.gridTemplateColumns = '1fr';
  admin.html:4635:                    salesContainer.style.gap = '0.8rem';
  admin.html:4636:                    salesContainer.style.marginTop = '0.5rem';
  admin.html:4637:                    salesContainer.style.paddingTop = '1rem';
  admin.html:4638:                    salesContainer.style.borderTop = '1px solid var(--glass-border)';
  admin.html:4639:
  admin.html:4640:                    const activeSales = [];
  admin.html:4641:                    const expiredSales = [];
  admin.html:4642:
  admin.html:4643:                    salesArray.forEach(sale => {
  admin.html:4644:                        if (!sale) return;
  admin.html:4645:                        const now = Date.now();
  admin.html:4646:                        const expEndOfDay = sale.expirationDate;
  admin.html:4647:                        const isExpired = now > expEndOfDay;
  admin.html:4648:                        if (isExpired) expiredSales.push(sale);
  admin.html:4649:                        else activeSales.push(sale);
  admin.html:4650:                    });
  admin.html:4651:
  admin.html:4652:                    // Render Active Sales
  admin.html:4653:                    activeSales.forEach(sale => {
  admin.html:4654:                        renderAdminSaleCard(sale, false, c, salesContainer);
  admin.html:4655:                    });
  admin.html:4656:
  admin.html:4657:                    // Render Expired Section
  admin.html:4658:                    if (expiredSales.length > 0) {
  admin.html:4659:                        const expHeader = document.createElement('div');
  admin.html:4660:                        expHeader.style.gridColumn = '1 / -1';
  admin.html:4661:                        expHeader.style.padding = '0.5rem';
  admin.html:4662:                        expHeader.style.background = 'rgba(255, 77, 77, 0.1)';
  admin.html:4663:                        expHeader.style.borderRadius = '8px';
  admin.html:4664:                        expHeader.style.color = '#ff4d4d';
  admin.html:4665:                        expHeader.style.fontSize = '0.9rem';
  admin.html:4666:                        expHeader.style.fontWeight = 'bold';
  admin.html:4667:                        expHeader.style.marginTop = '1rem';
  admin.html:4668:                        expHeader.style.textAlign = 'center';
  admin.html:4669:                        expHeader.style.border = '1px dashed rgba(255, 77, 77, 0.3)';
  admin.html:4670:                        expHeader.innerHTML = '<i class="fa-solid fa-folder-open"></i> PANTALLAS 
VENCIDAS (HISTORIAL)';
  admin.html:4671:                        salesContainer.appendChild(expHeader);
  admin.html:4672:
  admin.html:4673:                        expiredSales.forEach(sale => {
  admin.html:4674:                            renderAdminSaleCard(sale, true, c, salesContainer);
  admin.html:4675:                        });
  admin.html:4676:                    }
  admin.html:4677:
  admin.html:4678:                    div.appendChild(salesContainer);
  admin.html:4679:                }
  admin.html:4680:
  admin.html:4681:                listDiv.appendChild(div);
  admin.html:4682:                } catch (err) {
  admin.html:4683:                    console.error("Error rendering client:", c.phone, err);
  admin.html:4684:                }
  admin.html:4685:            });
  admin.html:4686:            } catch (err) {
  admin.html:4687:                console.error("Critical error in renderAllClientsList:", err);
  admin.html:4688:            }
  admin.html:4689:        }
  admin.html:4690:
  admin.html:4691:        function deleteClientSale(phone, saleId) {
  admin.html:4692:            if (confirm('¿Estás seguro de que quieres eliminar este registro? (Útil si fue una 
prueba o error)')) {
  admin.html:4693:                db.ref(`clientSales/${phone}/${saleId}`).remove().then(() => {
  admin.html:4694:                    alert('Registro eliminado del historial del cliente.');
  admin.html:4695:                    fetchClientSalesHistory();
  admin.html:4696:                });
  admin.html:4697:            }
  admin.html:4698:        }
  admin.html:4699:
  admin.html:4700:        window.toggleSaleStatus = async function (type, personId, saleId, newStatus, phoneString) {
  admin.html:4701:            const dbPath = type === 'seller' ? `sellerSales/${personId}/${saleId}` : 
`clientSales/${personId}/${saleId}`;
  admin.html:4702:            try {
  admin.html:4703:                await db.ref(dbPath).update({ isPaid: newStatus });
  admin.html:4704:                if (newStatus && phoneString) {
  admin.html:4705:                    if (confirm('¿Deseas enviar el mensaje de Pago Verificado por WhatsApp al 
cliente/vendedor?')) {
  admin.html:4706:                        const msg = "¡Hola! Te confirmamos que tu *pago ha sido verificado y 
registrado exitosamente*. ✅\n\nGracias por tu confianza.";
  admin.html:4707:                        
  admin.html:4708:                        // NEW LOGIC: If it's a seller's sale, personId is the seller name
  admin.html:4709:                        if (type === 'seller' && personId !== 'Página Web Oficial' && personId !== 
'Admin') {
  admin.html:4710:                            db.ref(`sellerStores/${personId}/whatsapp`).once('value').then(snap => {
  admin.html:4711:                                const sWpp = snap.val();
  admin.html:4712:                                let sellerMsg = `✅ *Pago Verificado - Streaming DPC*\n\nHola 
*${personId}*, te confirmamos que el pago de la cuenta de tu cliente (${phoneString}) ha sido *VERIFICADO*.`;
  admin.html:4713:                                if (sWpp) {
  admin.html:4714:                                    let sPhone = sWpp.toString().replace(/\D/g, '');
  admin.html:4715:                                    if (sPhone.length === 10 && sPhone.startsWith('3')) sPhone = 
'57' + sPhone;
  admin.html:4716:                                    window.openWhatsapp(sPhone, sellerMsg);
  admin.html:4717:                                } else {
  admin.html:4718:                                    window.openWhatsapp(null, sellerMsg);
  admin.html:4719:                                }
  admin.html:4720:                            });
  admin.html:4721:                        } else {
  admin.html:4722:                            let waPhone = phoneString.replace(/\D/g, '');
  admin.html:4723:                            if (waPhone.length === 10 && waPhone.startsWith('3')) waPhone = '57' + 
waPhone;
  admin.html:4724:                            window.openWhatsapp(waPhone, msg);
  admin.html:4725:                        }
  admin.html:4726:                    }
  admin.html:4727:                }
  admin.html:4728:                alert(`Estado actualizado a ${newStatus ? 'Pagado' : 'Pendiente'}.`);
  admin.html:4729:                if (type === 'seller') fetchSellerSalesStats();
  admin.html:4730:                else fetchClientSalesHistory();
  admin.html:4731:            } catch (err) {
  admin.html:4732:                alert('Error al cambiar el estado.');
  admin.html:4733:            }
  admin.html:4734:        };
  admin.html:4735:
  admin.html:4736:        async function deleteSelectedClientSales() {
  admin.html:4737:            const checkboxes = document.querySelectorAll('.client-sale-checkbox:checked');
  admin.html:4738:            if (checkboxes.length === 0) return alert('Selecciona al menos un registro marcando la 
casilla correspondiente para eliminar.');
  admin.html:4739:
  admin.html:4740:            if (confirm(`¿Estás seguro de eliminar ${checkboxes.length} registro(s) seleccionado(s) 
de los clientes directos?`)) {
  admin.html:4741:                let updates = {};
  admin.html:4742:                checkboxes.forEach(cb => {
  admin.html:4743:                    const [phone, id] = cb.value.split('|');
  admin.html:4744:                    updates[`clientSales/${phone}/${id}`] = null;
  admin.html:4745:                });
  admin.html:4746:
  admin.html:4747:                try {
  admin.html:4748:                    await db.ref().update(updates);
  admin.html:4749:                    alert(`Registros eliminados correctamente (${checkboxes.length}).`);
  admin.html:4750:                    fetchClientSalesHistory();
  admin.html:4751:                } catch (err) {
  admin.html:4752:                    alert('Hubo un error al eliminar los registros.');
  admin.html:4753:                    console.error(err);
  admin.html:4754:                }
  admin.html:4755:            }
  admin.html:4756:        }
  admin.html:4757:
  admin.html:4758:        async function sendAdminReminderToDirectClient(clientName, itemsEncoded, clientPhone, 
saleTotal) {
  admin.html:4759:            const itemsStr = safeDecode(itemsEncoded);
  admin.html:4760:            const cName = safeDecode(clientName);
  admin.html:4761:
  admin.html:4762:            // Obtener pin del cliente primero
  admin.html:4763:            let clientPin = "No asignado";
  admin.html:4764:            if (clientPhone) {
  admin.html:4765:                let cleanPhone = clientPhone.replace(/\D/g, "");
  admin.html:4766:                try {
  admin.html:4767:                    const snap = await db.ref(`clientProfiles/${cleanPhone}/pin`).once("value");
  admin.html:4768:                    if (snap.exists() && snap.val()) {
  admin.html:4769:                        clientPin = snap.val();
  admin.html:4770:                    }
  admin.html:4771:                } catch(e) {}
  admin.html:4772:            }
  admin.html:4773:
  admin.html:4774:            // Reemplazar variables del template (igual que seller reminder - sin concatenacion 
extra)
  admin.html:4775:            // Variables: {cliente}, {pantallas}, {total}, {celular}, {pin}, {pago}
  admin.html:4776:            let template = storeConfig.reminderTemplate || "Hola *{cliente}* \uD83D\uDE0A Buen 
dia\n\nTU *{pantallas}* \n\n\uD83D\uDC49 *FINALIZA HOY* \uD83D\uDC48\n\n\u26A0\uFE0F Si deseas continuar, realiza el 
pago y me env\u00EDas la foto del comprobante\uD83E\uDDFE (sin comprobante no cuenta como pago v\u00E1lido) 
\u26A0\uFE0F\n\n\uD83D\uDCB0 *Total a Renovar:* ${total}\n\n{pago}\n\nCelular: *{celular}* y Pin: *{pin}*";
  admin.html:4777:
  admin.html:4778:            let msg = template
  admin.html:4779:                .replace(/{cliente}/g, cName)
  admin.html:4780:                .replace(/{pantallas}/g, itemsStr)
  admin.html:4781:                .replace(/{celular}/g, clientPhone || "N/A")
  admin.html:4782:                .replace(/{pin}/g, clientPin)
  admin.html:4783:                .replace(/{total}/g, saleTotal > 0 ? saleTotal.toLocaleString() : "0")
  admin.html:4784:                .replace(/{pago}/g, storeConfig.paymentInfo || "");
  admin.html:4785:
  admin.html:4786:            const encodedMsg = encodeURIComponent(msg);
  admin.html:4787:
  admin.html:4788:            // Agregar codigo de pais si es numero colombiano local
  admin.html:4789:            let waPhone = clientPhone.replace(/\D/g, "");
  admin.html:4790:            if (waPhone.length === 10 && waPhone.startsWith("3")) {
  admin.html:4791:                waPhone = "57" + waPhone;
  admin.html:4792:            }
  admin.html:4793:
  admin.html:4794:            window.openWhatsapp(waPhone, decodeURIComponent(encodedMsg));
  admin.html:4795:        }
  admin.html:4796:
  admin.html:4797:        function updateEditClientDatesUI(saleObj) {
  admin.html:4798:            if (saleObj.date) {
  admin.html:4799:                const sd = new Date(saleObj.date);
  admin.html:4800:                document.getElementById('edit-client-start-date').value = 
`${sd.getFullYear()}-${String(sd.getMonth() + 1).padStart(2, '0')}-${String(sd.getDate()).padStart(2, '0')}`;
  admin.html:4801:            } else document.getElementById('edit-client-start-date').value = '';
  admin.html:4802:
  admin.html:4803:            if (saleObj.expirationDate) {
  admin.html:4804:                const ed = new Date(saleObj.expirationDate);
  admin.html:4805:                document.getElementById('edit-client-end-date').value = 
`${ed.getFullYear()}-${String(ed.getMonth() + 1).padStart(2, '0')}-${String(ed.getDate()).padStart(2, '0')}`;
  admin.html:4806:            } else document.getElementById('edit-client-end-date').value = '';
  admin.html:4807:        }
  admin.html:4808:
  admin.html:4809:        window.onEditClientSaleChange = function() {
  admin.html:4810:            const selectElement = document.getElementById('edit-client-select-sale');
  admin.html:4811:            const selectedKey = selectElement.value;
  admin.html:4812:            if (window.currentClientSales && selectedKey && window.currentClientSales[selectedKey]) {
  admin.html:4813:                window.currentEditingSaleKey = selectedKey;
  admin.html:4814:                const s = window.currentClientSales[selectedKey];
  admin.html:4815:                window.currentEditingOriginalDate = s.date;
  admin.html:4816:                updateEditClientDatesUI(s);
  admin.html:4817:                updateEditSaleEmailsUI(s);
  admin.html:4818:            }
  admin.html:4819:        };
  admin.html:4820:
  admin.html:4821:        function clickEditClient(phone) {
  admin.html:4822:            document.getElementById('search-client-phone').value = phone;
  admin.html:4823:            searchClient();
  admin.html:4824:            window.scrollTo({ top: 0, behavior: 'smooth' });
  admin.html:4825:        }
  admin.html:4826:
  admin.html:4827:        async function searchClient() {
  admin.html:4828:            const phone = window.sanitizePhone(document.getElementById('search-client-phone').value);
  admin.html:4829:            if (!phone || phone.length < 5) return alert('Ingresa un número de teléfono válido.');
  admin.html:4830:
  admin.html:4831:            try {
  admin.html:4832:                const snap = await db.ref(`clientSales/${phone}`).once('value');
  admin.html:4833:                const sales = snap.val();
  admin.html:4834:                if (!sales) {
  admin.html:4835:                    alert('No se encontraron compras en el historial para ese número de teléfono.');
  admin.html:4836:                    document.getElementById('client-edit-area').style.display = 'none';
  admin.html:4837:                    return;
  admin.html:4838:                }
  admin.html:4839:
  admin.html:4840:                // Get the most recent details
  admin.html:4841:                const sortedKeys = Object.keys(sales).sort((k1, k2) => sales[k2].date - 
sales[k1].date);
  admin.html:4842:                window.currentClientSales = sales;
  admin.html:4843:
  admin.html:4844:                const selectElement = document.getElementById('edit-client-select-sale');
  admin.html:4845:                if (selectElement) {
  admin.html:4846:                    selectElement.innerHTML = '';
  admin.html:4847:                    sortedKeys.forEach(k => {
  admin.html:4848:                        const s = sales[k];
  admin.html:4849:                        const opt = document.createElement('option');
  admin.html:4850:                        opt.value = k;
  admin.html:4851:                        const itemsText = s.items ? s.items.map(i => i.name).join(', ') : 'Pantalla';
  admin.html:4852:                        const dateText = s.date ? new Date(s.date).toLocaleDateString() : 'N/A';
  admin.html:4853:                        let fName = itemsText;
  admin.html:4854:                        if (fName.length > 50) fName = fName.substring(0, 47) + '...';
  admin.html:4855:                        opt.text = `${fName} (Comprado: ${dateText})`;
  admin.html:4856:                        selectElement.appendChild(opt);
  admin.html:4857:                    });
  admin.html:4858:                }
  admin.html:4859:
  admin.html:4860:                window.currentEditingSaleKey = sortedKeys[0];
  admin.html:4861:                if (selectElement) selectElement.value = window.currentEditingSaleKey;
  admin.html:4862:
  admin.html:4863:                let latestSale = sales[window.currentEditingSaleKey];
  admin.html:4864:                document.getElementById('edit-client-name').value = safeDecode(latestSale.clientName 
|| '');
  admin.html:4865:                document.getElementById('edit-client-city').value = latestSale.clientCity || '';
  admin.html:4866:                document.getElementById('edit-client-phone-new').value = '';
  admin.html:4867:
  admin.html:4868:                window.currentEditingOriginalDate = latestSale.date;
  admin.html:4869:                updateEditClientDatesUI(latestSale);
  admin.html:4870:
  admin.html:4871:                // Fetch PIN if any
  admin.html:4872:                const pinSnap = await db.ref(`clientProfiles/${phone}/pin`).once('value');
  admin.html:4873:                document.getElementById('edit-client-pin').value = pinSnap.val() || '';
  admin.html:4874:
  admin.html:4875:                // Fetch email from latest sale
  admin.html:4876:                if (document.getElementById('edit-client-email')) {
  admin.html:4877:                    document.getElementById('edit-client-email').value = latestSale.email || '';
  admin.html:4878:                }
  admin.html:4879:
  admin.html:4880:                updateEditSaleEmailsUI(latestSale);
  admin.html:4881:
  admin.html:4882:                currentEditingClientPhone = phone;
  admin.html:4883:                document.getElementById('client-edit-area').style.display = 'block';
  admin.html:4884:
  admin.html:4885:                // Check block status
  admin.html:4886:                const blocked = storeConfig.blockedClients || [];
  admin.html:4887:                const blockBtn = document.getElementById('btn-block-client');
  admin.html:4888:                if (blocked.includes(phone)) {
  admin.html:4889:                    blockBtn.innerHTML = '<i class="fa-solid fa-unlock"></i> Desbloquear Celular';
  admin.html:4890:                    blockBtn.style.background = '#4cd137';
  admin.html:4891:                } else {
  admin.html:4892:                    blockBtn.innerHTML = '<i class="fa-solid fa-ban"></i> Bloquear Celular';
  admin.html:4893:                    blockBtn.style.background = '#ff4d4d';
  admin.html:4894:                }
  admin.html:4895:
  admin.html:4896:            } catch (err) {
  admin.html:4897:                alert('Error buscando en la base de datos.');
  admin.html:4898:                console.error(err);
  admin.html:4899:            }
  admin.html:4900:        }
  admin.html:4901:
  admin.html:4902:        async function deleteSpecificSale() {
  admin.html:4903:            const saleKey = document.getElementById('edit-client-select-sale').value;
  admin.html:4904:            if (!saleKey || !currentEditingClientPhone) return alert('No hay ninguna venta 
seleccionada.');
  admin.html:4905:
  admin.html:4906:            if (!confirm('¿Estás SEGURO de eliminar esta venta permanentemente de TODAS las listas 
(cliente y vendedor)? Esta acción no se puede deshacer.')) return;
  admin.html:4907:
  admin.html:4908:            try {
  admin.html:4909:                const sale = window.currentClientSales[saleKey];
  admin.html:4910:                const sellerName = sale.sellerName || 'Página Web Oficial';
  admin.html:4911:                const updates = {};
  admin.html:4912:
  admin.html:4913:                // 1. Eliminar de clientSales
  admin.html:4914:                updates[`clientSales/${currentEditingClientPhone}/${saleKey}`] = null;
  admin.html:4915:
  admin.html:4916:                // 2. Eliminar de sellerSales
  admin.html:4917:                // Buscamos la venta en el vendedor (usamos el saleKey o buscamos por fecha si el 
key es distinto)
  admin.html:4918:                const sellerSnap = await db.ref(`sellerSales/${sellerName}`).once('value');
  admin.html:4919:                const sellerSales = sellerSnap.val() || {};
  admin.html:4920:                
  admin.html:4921:                let foundInSeller = false;
  admin.html:4922:                if (sellerSales[saleKey]) {
  admin.html:4923:                    updates[`sellerSales/${sellerName}/${saleKey}`] = null;
  admin.html:4924:                    foundInSeller = true;
  admin.html:4925:                } else {
  admin.html:4926:                    // Si el ID no coincide (raro pero posible), buscamos por fecha
  admin.html:4927:                    for (let sid in sellerSales) {
  admin.html:4928:                        if (sellerSales[sid].date === sale.date && sellerSales[sid].clientPhone === 
currentEditingClientPhone) {
  admin.html:4929:                            updates[`sellerSales/${sellerName}/${sid}`] = null;
  admin.html:4930:                            foundInSeller = true;
  admin.html:4931:                            break;
  admin.html:4932:                        }
  admin.html:4933:                    }
  admin.html:4934:                }
  admin.html:4935:
  admin.html:4936:                await db.ref().update(updates);
  admin.html:4937:                alert('Venta eliminada con éxito.');
  admin.html:4938:                searchClient(); // Recargar el historial del cliente
  admin.html:4939:            } catch (err) {
  admin.html:4940:                console.error(err);
  admin.html:4941:                alert('Error al eliminar la venta.');
  admin.html:4942:            }
  admin.html:4943:        }
  admin.html:4944:
  admin.html:4945:        async function saveClientEdits() {
  admin.html:4946:            if (!currentEditingClientPhone) return;
  admin.html:4947:
  admin.html:4948:            // === LEER TODO EL DOM ANTES DEL CONFIRM Y LOS AWAITS ===
  admin.html:4949:            const newName = (document.getElementById('edit-client-name').value || '').trim();
  admin.html:4950:            const newCity = (document.getElementById('edit-client-city').value || '').trim();
  admin.html:4951:            const updateAllHistory = document.getElementById('edit-client-update-all') ? 
document.getElementById('edit-client-update-all').checked : true;
  admin.html:4952:            const endVal = document.getElementById('edit-client-end-date').value;
  admin.html:4953:            const endTime = document.getElementById('edit-client-end-time').value || '23:59';
  admin.html:4954:            const newPin = document.getElementById('edit-client-pin').value.trim();
  admin.html:4955:            const newPhoneInput = (document.getElementById('edit-client-phone-new').value || 
'').replace(/\D/g, '');
  admin.html:4956:            const newEmail = document.getElementById('edit-client-email') ? 
document.getElementById('edit-client-email').value.trim() : null;
  admin.html:4957:
  admin.html:4958:            // Capturar emails por pantalla del DOM antes del confirm
  admin.html:4959:            const capturedHistoryEmails = {};
  admin.html:4960:            const capturedHistoryAliases = {};
  admin.html:4961:            
  admin.html:4962:            document.querySelectorAll('#history-emails-list .history-email-group').forEach(group => {
  admin.html:4963:                const itemIdx = parseInt(group.dataset.itemIndex) || 0;
  admin.html:4964:                if (!capturedHistoryEmails[itemIdx]) capturedHistoryEmails[itemIdx] = [];
  admin.html:4965:                capturedHistoryEmails[itemIdx].push({
  admin.html:4966:                    platform: (group.querySelector('.history-platform-input') ? 
group.querySelector('.history-platform-input').value.trim() : ''),
  admin.html:4967:                    email: (group.querySelector('.history-email-input') ? 
group.querySelector('.history-email-input').value.trim() : '')
  admin.html:4968:                });
  admin.html:4969:            });
  admin.html:4970:            
  admin.html:4971:            document.querySelectorAll('#history-emails-list .history-alias-input').forEach(input => {
  admin.html:4972:                const itemIdx = parseInt(input.dataset.itemIndex) || 0;
  admin.html:4973:                capturedHistoryAliases[itemIdx] = input.value.trim();
  admin.html:4974:            });
  admin.html:4975:            const hasHistoryEmails = Object.keys(capturedHistoryEmails).length > 0;
  admin.html:4976:            console.log('[SAVE] Emails capturados del DOM:', JSON.stringify(capturedHistoryEmails));
  admin.html:4977:            console.log('[SAVE] Email general:', newEmail);
  admin.html:4978:
  admin.html:4979:            if (!newName) return;
  admin.html:4980:            if (!confirm('¿Actualizar registros?')) return;
  admin.html:4981:
  admin.html:4982:            try {
  admin.html:4983:                const [snap, sSnap] = await Promise.all([
  admin.html:4984:                    db.ref('clientSales/' + currentEditingClientPhone).once('value'),
  admin.html:4985:                    db.ref('sellerSales').once('value')
  admin.html:4986:                ]);
  admin.html:4987:                const sales = snap.val();
  admin.html:4988:                const allSellers = sSnap.val();
  admin.html:4989:                const globalUpdates = {};
  admin.html:4990:                if (sales) {
  admin.html:4991:                    Object.keys(sales).forEach(saleKey => {
  admin.html:4992:                        const isSpecificSale = (saleKey === window.currentEditingSaleKey);
  admin.html:4993:                        if (updateAllHistory || isSpecificSale) {
  admin.html:4994:                            globalUpdates['clientSales/' + currentEditingClientPhone + '/' + saleKey 
+ '/clientName'] = newName;
  admin.html:4995:                            globalUpdates['clientSales/' + currentEditingClientPhone + '/' + saleKey 
+ '/clientCity'] = newCity;
  admin.html:4996:                        }
  admin.html:4997:                    });
  admin.html:4998:                    if (window.currentEditingSaleKey && sales[window.currentEditingSaleKey]) {
  admin.html:4999:                        if (endVal) globalUpdates['clientSales/' + currentEditingClientPhone + '/' + 
window.currentEditingSaleKey + '/expirationDate'] = new Date(endVal + 'T' + endTime).getTime();
  admin.html:5000:                        if (newEmail !== null) globalUpdates['clientSales/' + 
currentEditingClientPhone + '/' + window.currentEditingSaleKey + '/email'] = newEmail;
  admin.html:5001:
  admin.html:5002:                        // Guardar emails especificos usando valores capturados del DOM
  admin.html:5003:                        if (hasHistoryEmails) {
  admin.html:5004:                            const currentSale = sales[window.currentEditingSaleKey];
  admin.html:5005:                            let itemsRaw = currentSale.items || [];
  admin.html:5006:                            let itemsArr = Array.isArray(itemsRaw) ? itemsRaw : 
Object.values(itemsRaw || {});
  admin.html:5007:                            const updatedItems = itemsArr.map((item, idx) => {
  admin.html:5008:                                let newItem = Object.assign({}, item);
  admin.html:5009:                                if (capturedHistoryEmails[idx]) {
  admin.html:5010:                                    newItem.specificEmails = capturedHistoryEmails[idx];
  admin.html:5011:                                }
  admin.html:5012:                                if (capturedHistoryAliases[idx] !== undefined) {
  admin.html:5013:                                    newItem.customName = capturedHistoryAliases[idx] || null;
  admin.html:5014:                                }
  admin.html:5015:                                return newItem;
  admin.html:5016:                            });
  admin.html:5017:                            globalUpdates['clientSales/' + currentEditingClientPhone + '/' + 
window.currentEditingSaleKey + '/items'] = updatedItems;
  admin.html:5018:                            console.log('[SAVE] updatedItems:', JSON.stringify(updatedItems));
  admin.html:5019:                        }
  admin.html:5020:                    }
  admin.html:5021:                }
  admin.html:5022:                if (updateAllHistory) {
  admin.html:5023:                    globalUpdates['clientProfiles/' + currentEditingClientPhone + '/name'] = newName;
  admin.html:5024:                }
  admin.html:5025:                if (allSellers) {
  admin.html:5026:                    for (let sn in allSellers) {
  admin.html:5027:                        for (let sid in allSellers[sn]) {
  admin.html:5028:                            if (allSellers[sn][sid].clientPhone === currentEditingClientPhone) {
  admin.html:5029:                                const isSpecificSale = (sid === window.currentEditingSaleKey || 
allSellers[sn][sid].date === window.currentEditingOriginalDate);
  admin.html:5030:                                if (updateAllHistory || isSpecificSale) {
  admin.html:5031:                                    globalUpdates['sellerSales/' + sn + '/' + sid + '/clientName'] = 
newName;
  admin.html:5032:                                    globalUpdates['sellerSales/' + sn + '/' + sid + '/clientCity'] = 
newCity;
  admin.html:5033:                                    // FIX: También actualizar el email en sellerSales para que el 
vendedor lo vea reflejado
  admin.html:5034:                                    if (newEmail !== null) globalUpdates['sellerSales/' + sn + '/' + 
sid + '/email'] = newEmail;
  admin.html:5035:                                }
  admin.html:5036:                                if (isSpecificSale) {
  admin.html:5037:                                     if (endVal) globalUpdates['sellerSales/' + sn + '/' + sid + 
'/expirationDate'] = new Date(endVal + 'T' + endTime).getTime();
  admin.html:5038:                                }
  admin.html:5039:                            }
  admin.html:5040:                        }
  admin.html:5041:                    }
  admin.html:5042:                }
  admin.html:5043:                console.log('[SAVE] globalUpdates keys:', Object.keys(globalUpdates));
  admin.html:5044:                if (Object.keys(globalUpdates).length > 0) await db.ref('/').update(globalUpdates);
  admin.html:5045:
  admin.html:5046:                if (newPhoneInput && newPhoneInput !== currentEditingClientPhone && 
newPhoneInput.length >= 5) {
  admin.html:5047:                    if (confirm('¿MIGRAR historial?')) {
  admin.html:5048:                        const migData = {};
  admin.html:5049:                        if (sales) {
  admin.html:5050:                            Object.keys(sales).forEach(sk => {
  admin.html:5051:                                sales[sk].clientName = newName;
  admin.html:5052:                                sales[sk].clientCity = newCity;
  admin.html:5053:                                sales[sk].clientPhone = newPhoneInput;
  admin.html:5054:                            });
  admin.html:5055:                            migData['clientSales/' + newPhoneInput] = sales;
  admin.html:5056:                            migData['clientSales/' + currentEditingClientPhone] = null;
  admin.html:5057:                        }
  admin.html:5058:                        const pSnap = await db.ref('clientProfiles/' + 
currentEditingClientPhone).once('value');
  admin.html:5059:                        migData['clientProfiles/' + newPhoneInput] = pSnap.val() || { name: newName 
};
  admin.html:5060:                        migData['clientProfiles/' + currentEditingClientPhone] = null;
  admin.html:5061:                        if (allSellers) {
  admin.html:5062:                             for (let sn in allSellers) {
  admin.html:5063:                                 for (let sid in allSellers[sn]) {
  admin.html:5064:                                     if (allSellers[sn][sid].clientPhone === 
currentEditingClientPhone) {
  admin.html:5065:                                         migData['sellerSales/' + sn + '/' + sid + '/clientPhone'] = 
newPhoneInput;
  admin.html:5066:                                         migData['sellerSales/' + sn + '/' + sid + '/clientName'] = 
newName;
  admin.html:5067:                                         migData['sellerSales/' + sn + '/' + sid + '/clientCity'] = 
newCity;
  admin.html:5068:                                     }
  admin.html:5069:                                 }
  admin.html:5070:                             }
  admin.html:5071:                        }
  admin.html:5072:                        await db.ref('/').update(migData);
  admin.html:5073:                        alert('Migración Exitosa.');
  admin.html:5074:                        window.location.reload();
  admin.html:5075:                        return;
  admin.html:5076:                    }
  admin.html:5077:                }
  admin.html:5078:                if (newPin) await db.ref('clientProfiles/' + currentEditingClientPhone + 
'/pin').set(newPin);
  admin.html:5079:                else await db.ref('clientProfiles/' + currentEditingClientPhone + '/pin').remove();
  admin.html:5080:                alert('Datos actualizados correctamente.');
  admin.html:5081:                searchClient();
  admin.html:5082:            } catch (err) {
  admin.html:5083:                console.error(err);
  admin.html:5084:                alert('Error: ' + err.message);
  admin.html:5085:            }
  admin.html:5086:        }
  admin.html:5087:        function toggleBlockClient() {
  admin.html:5088:            if (!currentEditingClientPhone) return;
  admin.html:5089:            if (!storeConfig.blockedClients) storeConfig.blockedClients = [];
  admin.html:5090:
  admin.html:5091:            const idx = storeConfig.blockedClients.indexOf(currentEditingClientPhone);
  admin.html:5092:            if (idx === -1) {
  admin.html:5093:                if (confirm('¿Seguro que deseas bloquear este cliente? No podrá renovar ni solicitar 
más pantallas por su cuenta.')) {
  admin.html:5094:                    storeConfig.blockedClients.push(currentEditingClientPhone);
  admin.html:5095:                }
  admin.html:5096:            } else {
  admin.html:5097:                storeConfig.blockedClients.splice(idx, 1);
  admin.html:5098:                alert('Cliente desbloqueado.');
  admin.html:5099:            }
  admin.html:5100:
  admin.html:5101:            db.ref('storeConfig').set(storeConfig);
  admin.html:5102:            searchClient(); // Refresh the UI
  admin.html:5103:            renderBlockedClients();
  admin.html:5104:        }
  admin.html:5105:
  admin.html:5106:        function unblockClient(index) {
  admin.html:5107:            if (!storeConfig.blockedClients) return;
  admin.html:5108:            storeConfig.blockedClients.splice(index, 1);
  admin.html:5109:            db.ref('storeConfig').set(storeConfig);
  admin.html:5110:            renderBlockedClients();
  admin.html:5111:        }
  admin.html:5112:
  admin.html:5113:        function logout() {
  admin.html:5114:            localStorage.removeItem('adminLoggedIn');
  admin.html:5115:            window.location.href = 'login.html';
  admin.html:5116:        }
  admin.html:5117:
  admin.html:5118:        // No manually calling init() here anymore, it's called by Firebase observer.
  admin.html:5119:        function initApp() {
  admin.html:5120:            // function placeholder inside the script
  admin.html:5121:        }
  admin.html:5122:
  admin.html:5123:        let globalReminderQueue = [];
  admin.html:5124:
  admin.html:5125:        function checkDailyAutoReminders(force = false) {
  admin.html:5126:            const isTodayEnabled = storeConfig.autoReminderEnabled !== false && 
storeConfig.autoReminderEnabled !== "false";
  admin.html:5127:            const isTomorrowEnabled = storeConfig.autoReminderTomorrowEnabled !== false && 
storeConfig.autoReminderTomorrowEnabled !== "false";
  admin.html:5128:
  admin.html:5129:            if (!force && !isTodayEnabled && !isTomorrowEnabled) return;
  admin.html:5130:
  admin.html:5131:            const configHour = parseInt(storeConfig.autoReminderHour) || 0;
  admin.html:5132:            const currentHour = new Date().getHours();
  admin.html:5133:            if (!force && configHour > 0 && currentHour < configHour) return;
  admin.html:5134:
  admin.html:5135:            const todayStr = new Date().toLocaleDateString();
  admin.html:5136:            if (!force && localStorage.getItem('lastAutoReminderDate') === todayStr) {
  admin.html:5137:                if (force) alert('Ya se procesaron los recordatorios hoy, pero al forzar, volveremos 
a revisar...');
  admin.html:5138:                else return; // Already processed today
  admin.html:5139:            }
  admin.html:5140:
  admin.html:5141:            globalReminderQueue = [];
  admin.html:5142:
  admin.html:5143:            db.ref('/').once('value').then(snap => {
  admin.html:5144:                const data = snap.val() || {};
  admin.html:5145:                const cSales = data.clientSales || {};
  admin.html:5146:                const sSales = data.sellerSales || {};
  admin.html:5147:                const now = Date.now();
  admin.html:5148:
  admin.html:5149:                // Check end of month cleanup
  admin.html:5150:                const nowDate = new Date();
  admin.html:5151:                const lastDayOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 
0).getDate();
  admin.html:5152:                if (nowDate.getDate() === lastDayOfMonth && 
localStorage.getItem('lastAutoCleanupMonth') !== `${nowDate.getFullYear()}-${nowDate.getMonth()}`) {
  admin.html:5153:                    let updates = {};
  admin.html:5154:                    let cleanCount = 0;
  admin.html:5155:                    Object.keys(cSales).forEach(phone => {
  admin.html:5156:                        Object.keys(cSales[phone]).forEach(k => {
  admin.html:5157:                            if (cSales[phone][k].isPaid === false) { 
updates[`clientSales/${phone}/${k}`] = null; cleanCount++; }
  admin.html:5158:                        });
  admin.html:5159:                    });
  admin.html:5160:                    Object.keys(sSales).forEach(seller => {
  admin.html:5161:                        Object.keys(sSales[seller]).forEach(k => {
  admin.html:5162:                            if (sSales[seller][k].isPaid === false) { 
updates[`sellerSales/${seller}/${k}`] = null; cleanCount++; }
  admin.html:5163:                        });
  admin.html:5164:                    });
  admin.html:5165:                    if (Object.keys(updates).length > 0) {
  admin.html:5166:                        db.ref('/').update(updates).then(() => {
  admin.html:5167:                            console.log(`Auto-cleaned ${cleanCount} unpaid sales at end of month.`);
  admin.html:5168:                        });
  admin.html:5169:                    }
  admin.html:5170:                    localStorage.setItem('lastAutoCleanupMonth', 
`${nowDate.getFullYear()}-${nowDate.getMonth()}`);
  admin.html:5171:                }
  admin.html:5172:
  admin.html:5173:                // Direct Clientes
  admin.html:5174:                Object.keys(cSales).forEach(phone => {
  admin.html:5175:                    const salesMap = cSales[phone];
  admin.html:5176:                    Object.keys(salesMap).forEach(k => {
  admin.html:5177:                        const sale = salesMap[k];
  admin.html:5178:                        const daysLeft = Math.ceil((sale.expirationDate - now) / (1000 * 60 * 60 * 
24));
  admin.html:5179:
  admin.html:5180:                        if (daysLeft === 0 && isTodayEnabled) {
  admin.html:5181:                            let cName = safeDecode(sale.clientName || 'Cliente');
  admin.html:5182:                            if (!sale.clientName && data.clientProfiles && 
data.clientProfiles[phone]) {
  admin.html:5183:                                cName = safeDecode(data.clientProfiles[phone].name || 'Cliente');
  admin.html:5184:                            }
  admin.html:5185:                            globalReminderQueue.push({ type: 'direct', phone: phone, name: cName, 
sale: sale, daysLeft: daysLeft });
  admin.html:5186:                        } else if (daysLeft === 1 && isTomorrowEnabled) {
  admin.html:5187:                            let cName = safeDecode(sale.clientName || 'Cliente');
  admin.html:5188:                            if (!sale.clientName && data.clientProfiles && 
data.clientProfiles[phone]) {
  admin.html:5189:                                cName = safeDecode(data.clientProfiles[phone].name || 'Cliente');
  admin.html:5190:                            }
  admin.html:5191:                            globalReminderQueue.push({ type: 'direct', phone: phone, name: cName, 
sale: sale, daysLeft: daysLeft });
  admin.html:5192:                        }
  admin.html:5193:                    });
  admin.html:5194:                });
  admin.html:5195:
  admin.html:5196:                // Vendedores
  admin.html:5197:                Object.keys(sSales).forEach(sellerName => {
  admin.html:5198:                    const salesMap = sSales[sellerName];
  admin.html:5199:                    Object.keys(salesMap).forEach(k => {
  admin.html:5200:                        const sale = salesMap[k];
  admin.html:5201:                        const daysLeft = Math.ceil((sale.expirationDate - now) / (1000 * 60 * 60 * 
24));
  admin.html:5202:
  admin.html:5203:                        if (daysLeft === 0 && isTodayEnabled) {
  admin.html:5204:                            globalReminderQueue.push({ type: 'seller', phone: sale.clientPhone || 
'', seller: sellerName, name: sale.clientName || 'Cliente', sale: sale, daysLeft: daysLeft });
  admin.html:5205:                        } else if (daysLeft === 1 && isTomorrowEnabled) {
  admin.html:5206:                            globalReminderQueue.push({ type: 'seller', phone: sale.clientPhone || 
'', seller: sellerName, name: sale.clientName || 'Cliente', sale: sale, daysLeft: daysLeft });
  admin.html:5207:                        }
  admin.html:5208:                    });
  admin.html:5209:                });
  admin.html:5210:
  admin.html:5211:                if (globalReminderQueue.length > 0) {
  admin.html:5212:                    showAutoReminderUI();
  admin.html:5213:                } else {
  admin.html:5214:                    localStorage.setItem('lastAutoReminderDate', todayStr);
  admin.html:5215:                }
  admin.html:5216:            });
  admin.html:5217:        }
  admin.html:5218:
  admin.html:5219:        function showAutoReminderUI() { return;
  admin.html:5220:            let container = document.getElementById('auto-reminder-ui');
  admin.html:5221:            if (!container) {
  admin.html:5222:                container = document.createElement('div');
  admin.html:5223:                container.id = 'auto-reminder-ui';
  admin.html:5224:                container.style.position = 'fixed';
  admin.html:5225:                container.style.bottom = '20px';
  admin.html:5226:                container.style.right = '20px';
  admin.html:5227:                container.style.background = 'var(--surface-color)';
  admin.html:5228:                container.style.padding = '1.5rem';
  admin.html:5229:                container.style.borderRadius = '12px';
  admin.html:5230:                container.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
  admin.html:5231:                container.style.zIndex = '9999';
  admin.html:5232:                container.style.border = '2px solid var(--accent-light)';
  admin.html:5233:                container.style.width = '350px';
  admin.html:5234:                document.body.appendChild(container);
  admin.html:5235:            }
  admin.html:5236:
  admin.html:5237:            container.innerHTML = `
  admin.html:5238:                <h3 style="margin-top:0; color:white; font-size:1.1rem; display:flex; 
align-items:center; gap:8px;">
  admin.html:5239:                    <i class="fa-solid fa-robot" style="color:var(--accent-light);"></i> Asistente 
de Envíos
  admin.html:5240:                </h3>
  admin.html:5241:                <p style="font-size:0.85rem; color:#ccc; margin-bottom:1rem;">Tienes 
<strong>${globalReminderQueue.length}</strong> recordatorios (vencen hoy o mañana).</p>
  admin.html:5242:                <div style="display:flex; flex-direction:column; gap:0.5rem; max-height: 180px; 
overflow-y:auto; margin-bottom:1rem; padding-right:5px;">
  admin.html:5243:                    ${globalReminderQueue.map(r => `
  admin.html:5244:                        <div style="background:rgba(255,255,255,0.05); padding:8px; 
border-radius:6px; font-size:0.8rem; border-left: 3px solid ${r.daysLeft === 0 ? '#ff4d4d' : '#f39c12'}">
  admin.html:5245:                            <strong>${r.name}</strong> ${r.type === 'seller' ? '<span 
style="color:#a0a0a0; font-size:0.75rem;">(Vía Vendedor)</span>' : ''}<br>
  admin.html:5246:                            <span style="color:${r.daysLeft === 0 ? '#ff4d4d' : '#f39c12'}"><i 
class="fa-solid fa-clock"></i> Vence ${r.daysLeft === 0 ? 'HOY' : 'MAÑANA'}</span>
  admin.html:5247:                        </div>
  admin.html:5248:                    `).join('')}
  admin.html:5249:                </div>
  admin.html:5250:                <button onclick="startAutoRemindersQueue()" style="width:100%; padding: 12px; 
border-radius:8px; cursor:pointer; font-weight:bold; border:none; background:#4cd137; color:white; 
margin-bottom:0.5rem; box-shadow: 0 4px 15px rgba(76, 209, 55, 0.4);">
  admin.html:5251:                    <i class="fa-brands fa-whatsapp"></i> Enviar al Siguiente
  admin.html:5252:                </button>
  admin.html:5253:                <button onclick="dismissAutoReminders()" style="width:100%; padding: 8px; 
border-radius:8px; cursor:pointer; font-size:0.8rem; border:1px solid #ff4d4d; background:transparent; color:#ff4d4d;">
  admin.html:5254:                    Omitir por Hoy
  admin.html:5255:                </button>
  admin.html:5256:            `;
  admin.html:5257:        }
  admin.html:5258:
  admin.html:5259:        async function startAutoRemindersQueue() {
  admin.html:5260:            if (globalReminderQueue.length === 0) {
  admin.html:5261:                alert('Todos los recordatorios fueron revisados.');
  admin.html:5262:                dismissAutoReminders();
  admin.html:5263:                return;
  admin.html:5264:            }
  admin.html:5265:
  admin.html:5266:            const r = globalReminderQueue.shift();
  admin.html:5267:            const itemsStr = r.sale.items ? r.sale.items.map(i => {
  admin.html:5268:                let formatName = i.name;
  admin.html:5269:                if (i.category && i.category.startsWith('combos')) formatName = `🎬 *${i.name}* 
(Combo Prediseñado)`;
  admin.html:5270:                return formatName;
  admin.html:5271:            }).join(', ') : 'Pantallas';
  admin.html:5272:
  admin.html:5273:            if (r.daysLeft === 1) { // Tomorrow
  admin.html:5274:                let templateText = storeConfig.reminderTomorrowTemplate || "Hola {cliente} 
\uD83D\uDE0A Buen dia\nTe avisamos que TU {pantallas} finaliza \n\uD83D\uDC49 *MA\u00d1ANA* \uD83D\uDC48\n\u26A0\uFE0F 
Para evitar la suspensi\u00f3n, por favor realiza el pago con tiempo \u26A0\uFE0F\n\n\uD83D\uDCB0 *Total a Renovar:* 
${total}\n\n{pago}\n\nCelular: *{celular}* y Pin: *{pin}*";
  admin.html:5275:
  admin.html:5276:                if (r.type === "seller") {
  admin.html:5277:                    let clientPin = "No asignado";
  admin.html:5278:                    if (r.phone) {
  admin.html:5279:                        let cleanPhone = r.phone.replace(/\D/g, "");
  admin.html:5280:                        try {
  admin.html:5281:                            const snap = await 
db.ref(`clientProfiles/${cleanPhone}/pin`).once("value");
  admin.html:5282:                            if (snap.exists() && snap.val()) {
  admin.html:5283:                                clientPin = snap.val();
  admin.html:5284:                            }
  admin.html:5285:                        } catch(e) {}
  admin.html:5286:                    }
  admin.html:5287:
  admin.html:5288:                    let templateSeller = storeConfig.sellerReminderTomorrowTemplate || "Hola 
*{vendedor}* \uD83D\uDC4B\n\nTe damos Aviso Previo que la cuenta de tu cliente *{cliente}* (\uD83D\uDCF1 
{celular})\n\nCon: {pantallas}\n\uD83D\uDC49 *FINALIZA MA\u00d1ANA* \uD83D\uDC48\n\nPor favor cont\u00e1ctalo para 
gestionar su renovaci\u00f3n y evitar cortes.\n\nCelular: {celular} y Pin: {pin}\n\uD83D\uDCB0 *Total:* ${total}";
  admin.html:5289:
  admin.html:5290:                    let msgSeller = templateSeller
  admin.html:5291:                        .replace(/{vendedor}/g, r.seller)
  admin.html:5292:                        .replace(/{cliente}/g, r.name)
  admin.html:5293:                        .replace(/{pantallas}/g, itemsStr)
  admin.html:5294:                        .replace(/{celular}/g, r.phone || "N/A")
  admin.html:5295:                        .replace(/{pin}/g, clientPin)
  admin.html:5296:                        .replace(/{total}/g, (r.sale.total || 0).toLocaleString())
  admin.html:5297:                        .replace(/{pago}/g, storeConfig.paymentInfo || "");
  admin.html:5298:
  admin.html:5299:                    // BUSCAR WHATSAPP DEL VENDEDOR PARA COLA
  admin.html:5300:                    try {
  admin.html:5301:                        const snapS = await 
db.ref(`sellerStores/${r.seller}/whatsapp`).once("value");
  admin.html:5302:                        const sWpp = snapS.val();
  admin.html:5303:                        let sellerWa = "";
  admin.html:5304:                        if (sWpp) {
  admin.html:5305:                            sellerWa = sWpp.toString().replace(/\D/g, "");
  admin.html:5306:                            if (sellerWa.length === 10 && sellerWa.startsWith("3")) sellerWa = "57" 
+ sellerWa;
  admin.html:5307:                        }
  admin.html:5308:                        window.openWhatsapp(sellerWa, msgSeller);
  admin.html:5309:                    } catch(e) {
  admin.html:5310:                        window.openWhatsapp(null, msgSeller);
  admin.html:5311:                    }
  admin.html:5312:                } else {
  admin.html:5313:                    // Cliente directo - reemplazar variables del template (sin concatenacion extra)
  admin.html:5314:                    let clientPin = "No asignado";
  admin.html:5315:                    if (r.phone) {
  admin.html:5316:                        let cleanPhone = r.phone.replace(/\D/g, "");
  admin.html:5317:                        try {
  admin.html:5318:                            const snap = await 
db.ref(`clientProfiles/${cleanPhone}/pin`).once("value");
  admin.html:5319:                            if (snap.exists() && snap.val()) {
  admin.html:5320:                                clientPin = snap.val();
  admin.html:5321:                            }
  admin.html:5322:                        } catch(e) {}
  admin.html:5323:                    }
  admin.html:5324:                    let msgDirect = templateText
  admin.html:5325:                        .replace(/{cliente}/g, r.name)
  admin.html:5326:                        .replace(/{pantallas}/g, itemsStr)
  admin.html:5327:                        .replace(/{celular}/g, r.phone || "N/A")
  admin.html:5328:                        .replace(/{pin}/g, clientPin)
  admin.html:5329:                        .replace(/{total}/g, (r.sale.total || 0).toLocaleString())
  admin.html:5330:                        .replace(/{pago}/g, storeConfig.paymentInfo || "");
  admin.html:5331:
  admin.html:5332:                    let waPhone = r.phone.replace(/\D/g, "");
  admin.html:5333:                    if (waPhone.length === 10 && waPhone.startsWith("3")) waPhone = "57" + waPhone;
  admin.html:5334:                    window.openWhatsapp(waPhone, msgDirect);
  admin.html:5335:                }
  admin.html:5336:            } else { // Today
  admin.html:5337:                if (r.type === 'seller') {
  admin.html:5338:                    sendAdminReminderToSeller(r.seller, r.name, encodeURIComponent(itemsStr), 
r.phone, r.sale.total || 0);
  admin.html:5339:                } else {
  admin.html:5340:                    sendAdminReminderToDirectClient(r.name, encodeURIComponent(itemsStr), r.phone, 
r.sale.total || 0);
  admin.html:5341:                }
  admin.html:5342:            }
  admin.html:5343:
  admin.html:5344:            if (globalReminderQueue.length > 0) {
  admin.html:5345:                showAutoReminderUI();
  admin.html:5346:            } else {
  admin.html:5347:                dismissAutoReminders();
  admin.html:5348:                alert('¡Excelente! Has terminado de enviar los recordatorios de hoy.');
  admin.html:5349:            }
  admin.html:5350:        }
  admin.html:5351:
  admin.html:5352:        function dismissAutoReminders() {
  admin.html:5353:            localStorage.setItem('lastAutoReminderDate', new Date().toLocaleDateString());
  admin.html:5354:            const elem = document.getElementById('auto-reminder-ui');
  admin.html:5355:            if (elem) elem.style.display = 'none';
  admin.html:5356:        }
  admin.html:5357:        function guessPlatforms(productName, screenCount) {
  admin.html:5358:            if (!productName) return [];
  admin.html:5359:            let clean = 
productName.replace(/^(combo\s+\d+|trío|dúo|triple|cuádruple|combo)\s*[:\-]\s*/i, '');
  admin.html:5360:            let parts = clean.split(/\s*[\+\-\|]\s*/).map(s => s.trim()).filter(s => s);
  admin.html:5361:            let result = [];
  admin.html:5362:            for (let i = 0; i < screenCount; i++) {
  admin.html:5363:                result.push(parts[i] || productName);
  admin.html:5364:            }
  admin.html:5365:            return result;
  admin.html:5366:        }
  admin.html:5367:
  admin.html:5368:                function getScreenCount(cat, name) {
  admin.html:5369:            const c = (cat || '').toLowerCase().trim();
  admin.html:5370:            const n = (name || '').toLowerCase().trim();
  admin.html:5371:            
  admin.html:5372:            // Categoría exacta o nombre
  admin.html:5373:            if (c.includes('combo2') || c.includes('combos2') || (c.includes('combo') && 
c.includes('2')) || n.includes('duo') || n.includes('combo 2')) return 2;
  admin.html:5374:            if (c.includes('combo3') || c.includes('combos3') || (c.includes('combo') && 
c.includes('3')) || n.includes('trio') || n.includes('triple') || n.includes('combo 3')) return 3;
  admin.html:5375:            if (c.includes('combo4') || c.includes('combos4') || (c.includes('combo') && 
c.includes('4')) || n.includes('combo 4')) return 4;
  admin.html:5376:            if (c.includes('combo5') || c.includes('combos5') || (c.includes('combo') && 
c.includes('5')) || n.includes('combo 5')) return 5;
  admin.html:5377:            
  admin.html:5378:            // Detección genérica para promociones
  admin.html:5379:            if (c.includes('promo') || c.includes('combo')) {
  admin.html:5380:                if (n.includes('5')) return 5;
  admin.html:5381:                if (n.includes('4')) return 4;
  admin.html:5382:                if (n.includes('3')) return 3;
  admin.html:5383:                if (n.includes('2')) return 2;
  admin.html:5384:                if (n.includes('duo')) return 2;
  admin.html:5385:                if (n.includes('trio')) return 3;
  admin.html:5386:                
  admin.html:5387:                let clean = 
n.replace(/^(combo\s+\d+|trío|dúo|triple|cuádruple|combo|promo\s*\w*)\s*[:\-]\s*/i, '');
  admin.html:5388:                let parts = clean.split(/\s*[\+\-\|]\s*|\s+y\s+/).map(s => s.trim()).filter(s => 
s.length > 2);
  admin.html:5389:                if (parts.length > 1) return parts.length;
  admin.html:5390:            }
  admin.html:5391:
  admin.html:5392:            return 1;
  admin.html:5393:        }
  admin.html:5394:        window.updateManualEmailsUI = function(mode) {
  admin.html:5395:            const selectId = mode === 'manual' ? 'manual-client-product' : 'edit-client-add-product';
  admin.html:5396:            const containerId = mode === 'manual' ? 'manual-emails-container' : 
'edit-add-emails-container';
  admin.html:5397:            const listId = mode === 'manual' ? 'manual-emails-list' : 'edit-add-emails-list';
  admin.html:5398:            
  admin.html:5399:            const selectElem = document.getElementById(selectId);
  admin.html:5400:            const containerElem = document.getElementById(containerId);
  admin.html:5401:            const listElem = document.getElementById(listId);
  admin.html:5402:            
  admin.html:5403:            if (!selectElem || !containerElem || !listElem) return;
  admin.html:5404:            if (!dynamicProducts) return;
  admin.html:5405:            
  admin.html:5406:            const selectedOptions = Array.from(selectElem.selectedOptions).map(o => 
o.value).filter(v => v !== "");
  admin.html:5407:            console.log(`[DEBUG] updateManualEmailsUI mode=${mode} 
selected=${selectedOptions.length}`);
  admin.html:5408:
  admin.html:5409:            if (selectedOptions.length === 0) {
  admin.html:5410:                containerElem.style.display = 'none';
  admin.html:5411:                return;
  admin.html:5412:            }
  admin.html:5413:            
  admin.html:5414:            containerElem.style.display = 'block';
  admin.html:5415:            
  admin.html:5416:            const previousValues = {};
  admin.html:5417:            const previousAliases = {};
  admin.html:5418:            
  admin.html:5419:            // Capture existing emails (to preserve them if they change selection)
  admin.html:5420:            listElem.querySelectorAll('.manual-email-group').forEach(group => {
  admin.html:5421:                const prodId = group.dataset.prodId;
  admin.html:5422:                const index = group.dataset.index;
  admin.html:5423:                const emailInput = group.querySelector('.manual-email-input');
  admin.html:5424:                const platformInput = group.querySelector('.manual-platform-input');
  admin.html:5425:                if (prodId && index !== undefined && emailInput && platformInput) {
  admin.html:5426:                    previousValues[`${prodId}_${index}`] = { 
  admin.html:5427:                        email: emailInput.value, 
  admin.html:5428:                        platform: platformInput.value 
  admin.html:5429:                    };
  admin.html:5430:                }
  admin.html:5431:            });
  admin.html:5432:            
  admin.html:5433:            // Capture existing aliases
  admin.html:5434:            listElem.querySelectorAll('.manual-alias-input').forEach(input => {
  admin.html:5435:                const prodId = input.dataset.prodId;
  admin.html:5436:                if (prodId) previousAliases[prodId] = input.value;
  admin.html:5437:            });
  admin.html:5438:            
  admin.html:5439:            listElem.innerHTML = '';
  admin.html:5440:            
  admin.html:5441:            selectedOptions.forEach(prodId => {
  admin.html:5442:                const p = dynamicProducts.find(x => x && x.id && x.id.toString() === 
prodId.toString());
  admin.html:5443:                if (!p) return;
  admin.html:5444:                
  admin.html:5445:                const productWrapper = document.createElement('div');
  admin.html:5446:                productWrapper.className = 'manual-product-settings';
  admin.html:5447:                productWrapper.style = 'background: rgba(255,255,255,0.03); border: 1px solid 
var(--glass-border); padding: 15px; border-radius: 12px; margin-bottom: 15px;';
  admin.html:5448:                
  admin.html:5449:                const prevAlias = previousAliases[prodId] || "";
  admin.html:5450:                const screenCount = getScreenCount(p.category, p.name);
  admin.html:5451:                const guesses = guessPlatforms(p.name, screenCount);
  admin.html:5452:                
  admin.html:5453:                let screensHTML = '';
  admin.html:5454:                for (let i = 0; i < screenCount; i++) {
  admin.html:5455:                    const key = `${prodId}_${i}`;
  admin.html:5456:                    const prev = previousValues[key] || { email: '', platform: guesses[i] || p.brand 
|| p.name };
  admin.html:5457:                    
  admin.html:5458:                    screensHTML += `
  admin.html:5459:                        <div class="manual-email-group" data-prod-id="${prodId}" data-index="${i}" 
style="display:grid; grid-template-columns: 1fr 2fr; gap:10px; align-items:center; background:rgba(0,0,0,0.3); 
padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); margin-top: 10px;">
  admin.html:5460:                            <div>
  admin.html:5461:                                <label style="font-size:0.7rem; color:#aaa; margin-bottom:3px; 
display:block;">Plataforma</label>
  admin.html:5462:                                <input type="text" class="manual-platform-input" 
placeholder="Plataforma" value="${prev.platform}" style="padding:8px; font-size:0.85rem; border-radius:6px; 
background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; width:100%;">
  admin.html:5463:                            </div>
  admin.html:5464:                            <div>
  admin.html:5465:                                <label style="font-size:0.7rem; color:#aaa; margin-bottom:3px; 
display:block;">Email / Usuario</label>
  admin.html:5466:                                <input type="email" class="manual-email-input" placeholder="Email / 
Usuario" value="${prev.email}" style="padding:8px; font-size:0.85rem; border-radius:6px; 
background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; width:100%;">
  admin.html:5467:                            </div>
  admin.html:5468:                        </div>
  admin.html:5469:                    `;
  admin.html:5470:                }
  admin.html:5471:
  admin.html:5472:                productWrapper.innerHTML = `
  admin.html:5473:                    <div style="margin-bottom: 12px;">
  admin.html:5474:                        <label style="color: #4cd137; font-weight: bold; font-size: 0.9rem; display: 
block; margin-bottom: 6px;"><i class="fa-solid fa-box-open"></i> Producto: ${p.name}</label>
  admin.html:5475:                        <div style="background: rgba(243, 156, 18, 0.1); padding: 10px; 
border-radius: 8px; border: 1px solid rgba(243, 156, 18, 0.2);">
  admin.html:5476:                            <label style="color: #f39c12; font-weight: bold; font-size: 0.8rem; 
display: block; margin-bottom: 5px;">NOMBRE / ALIAS (EJ: PARA JUAN PÉREZ):</label>
  admin.html:5477:                            <input type="text" class="manual-alias-input" data-prod-id="${prodId}" 
placeholder="Escribe aquí el alias..." value="${prevAlias}" style="padding:10px; font-size:1rem; border-radius:8px; 
background:rgba(0,0,0,0.5); border:1px solid #f39c12; color:white; width:100%;">
  admin.html:5478:                        </div>
  admin.html:5479:                    </div>
  admin.html:5480:                    <div class="screens-container">
  admin.html:5481:                        <label style="color: #a0a0a0; font-size: 0.8rem; font-weight: bold; 
text-transform: uppercase;">Configuración de Pantallas:</label>
  admin.html:5482:                        ${screensHTML}
  admin.html:5483:                    </div>
  admin.html:5484:                `;
  admin.html:5485:                
  admin.html:5486:                listElem.appendChild(productWrapper);
  admin.html:5487:            });
  admin.html:5488:        };
  admin.html:5489:
  admin.html:5490:        window.updateEditSaleEmailsUI = function(sale) {
  admin.html:5491:            const container = document.getElementById('history-emails-container');
  admin.html:5492:            const list = document.getElementById('history-emails-list');
  admin.html:5493:            if (!container || !list) return;
  admin.html:5494:
  admin.html:5495:            let items = [];
  admin.html:5496:            if (!sale.items || (Array.isArray(sale.items) && sale.items.length === 0) || (typeof 
sale.items === 'object' && Object.keys(sale.items).length === 0)) {
  admin.html:5497:                // Modo de compatibilidad para ventas antiguas
  admin.html:5498:                if (sale.clientName) { // Si es una venta válida antigua
  admin.html:5499:                    items = [{
  admin.html:5500:                        id: 'legacy',
  admin.html:5501:                        name: sale.items ? 'Pantalla' : 'Compra Antigua', 
  admin.html:5502:                        category: '',
  admin.html:5503:                        specificEmails: []
  admin.html:5504:                    }];
  admin.html:5505:                    // Intentar deducir del nombre o algún lado, pero generalmente las viejas no 
tenían items
  admin.html:5506:                } else {
  admin.html:5507:                    container.style.display = 'none';
  admin.html:5508:                    return;
  admin.html:5509:                }
  admin.html:5510:            } else {
  admin.html:5511:                let itemsRaw = sale.items || [];
  admin.html:5512:                items = Array.isArray(itemsRaw) ? itemsRaw : Object.values(itemsRaw || {});
  admin.html:5513:            }
  admin.html:5514:
  admin.html:5515:            container.style.display = 'block';
  admin.html:5516:            list.innerHTML = '';
  admin.html:5517:
  admin.html:5518:            items.forEach((item, itemIdx) => {
  admin.html:5519:                const screenCount = getScreenCount(item.category, item.name);
  admin.html:5520:                const guesses = guessPlatforms(item.name, screenCount);
  admin.html:5521:                
  admin.html:5522:                const productWrapper = document.createElement('div');
  admin.html:5523:                productWrapper.style = 'background: rgba(255,255,255,0.03); border: 1px solid 
var(--glass-border); padding: 15px; border-radius: 12px; margin-bottom: 15px;';
  admin.html:5524:                
  admin.html:5525:                let screensHTML = '';
  admin.html:5526:                for (let i = 0; i < screenCount; i++) {
  admin.html:5527:                    const specific = (item.specificEmails && item.specificEmails[i]) ? 
item.specificEmails[i] : { platform: guesses[i] || item.name, email: '' };
  admin.html:5528:                    screensHTML += `
  admin.html:5529:                        <div class="history-email-group" data-item-index="${itemIdx}" 
style="display:grid; grid-template-columns: 1fr 2fr; gap:10px; align-items:center; background:rgba(0,0,0,0.3); 
padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); margin-top: 10px;">
  admin.html:5530:                            <div>
  admin.html:5531:                                <label style="font-size:0.75rem; color:#aaa; margin-bottom:3px; 
display:block;">Plataforma</label>
  admin.html:5532:                                <input type="text" class="history-platform-input" 
placeholder="Plataforma" value="${specific.platform || guesses[i] || item.name}" style="padding:6px; 
font-size:0.85rem; border-radius:6px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); 
color:white; width:100%;">
  admin.html:5533:                            </div>
  admin.html:5534:                            <div>
  admin.html:5535:                                <label style="font-size:0.75rem; color:#aaa; margin-bottom:3px; 
display:block;">Email / Usuario</label>
  admin.html:5536:                                <input type="email" class="history-email-input" placeholder="Email / 
Usuario" value="${specific.email || ''}" style="padding:6px; font-size:0.85rem; border-radius:6px; 
background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; width:100%;">
  admin.html:5537:                            </div>
  admin.html:5538:                        </div>
  admin.html:5539:                    `;
  admin.html:5540:                }
  admin.html:5541:
  admin.html:5542:                productWrapper.innerHTML = `
  admin.html:5543:                    <div style="margin-bottom: 12px;">
  admin.html:5544:                        <label style="color: #4cd137; font-weight: bold; font-size: 0.9rem; display: 
block; margin-bottom: 6px;"><i class="fa-solid fa-box-open"></i> Producto: ${item.name}</label>
  admin.html:5545:                        <div style="background: rgba(243, 156, 18, 0.1); padding: 10px; 
border-radius: 8px; border: 1px solid rgba(243, 156, 18, 0.2);">
  admin.html:5546:                            <label style="color: #f39c12; font-weight: bold; font-size: 0.8rem; 
display: block; margin-bottom: 5px;">NOMBRE / ALIAS (EJ: PARA JUAN PÉREZ):</label>
  admin.html:5547:                            <input type="text" class="history-alias-input" 
data-item-index="${itemIdx}" placeholder="Escribe aquí el alias..." value="${item.customName || ''}" 
style="padding:10px; font-size:1rem; border-radius:8px; background:rgba(0,0,0,0.5); border:1px solid #f39c12; 
color:white; width:100%;">
  admin.html:5548:                        </div>
  admin.html:5549:                    </div>
  admin.html:5550:                    <div class="screens-container">
  admin.html:5551:                        <label style="color: #a0a0a0; font-size: 0.8rem; font-weight: bold; 
text-transform: uppercase;">Configuración de Pantallas:</label>
  admin.html:5552:                        ${screensHTML}
  admin.html:5553:                    </div>
  admin.html:5554:                `;
  admin.html:5555:                list.appendChild(productWrapper);
  admin.html:5556:            });
  admin.html:5557:        };
  admin.html:5558:
  admin.html:5559:        window.renderManualClientProducts = function() {
  admin.html:5560:            const select1 = document.getElementById('manual-client-product');
  admin.html:5561:            const select2 = document.getElementById('edit-client-add-product');
  admin.html:5562:            
  admin.html:5563:            if (dynamicProducts) {
  admin.html:5564:                let html = '';
  admin.html:5565:                const categoryLabels = {
  admin.html:5566:                    'individual': 'Pantallas Individuales',
  admin.html:5567:                    'combos2': 'Combo 2 Pantallas',
  admin.html:5568:                    'combos3': 'Combo 3 Pantallas',
  admin.html:5569:                    'combos4': 'Combo 4 Pantallas',
  admin.html:5570:                    'combos5': 'Combo 5+ Pantallas',
  admin.html:5571:                    'promociones': 'Promociones (Mes)',
  admin.html:5572:                    'promociones_finde': 'Promociones Finde',
  admin.html:5573:                    'ventas_extras': 'Ventas Extras'
  admin.html:5574:                };
  admin.html:5575:
  admin.html:5576:                const grouped = {};
  admin.html:5577:                dynamicProducts.forEach(p => {
  admin.html:5578:                    if (p && p.category) {
  admin.html:5579:                        if (!grouped[p.category]) grouped[p.category] = [];
  admin.html:5580:                        grouped[p.category].push(p);
  admin.html:5581:                    }
  admin.html:5582:                });
  admin.html:5583:
  admin.html:5584:                Object.keys(grouped).forEach(cat => {
  admin.html:5585:                    const groupLabel = categoryLabels[cat] || cat.toUpperCase();
  admin.html:5586:                    html += `<optgroup label="--- ${groupLabel} ---">`;
  admin.html:5587:                    grouped[cat].forEach(p => {
  admin.html:5588:                        html += `<option value="${p.id}">${p.name} 
($${p.price.toLocaleString()})</option>`;
  admin.html:5589:                    });
  admin.html:5590:                    html += `</optgroup>`;
  admin.html:5591:                });
  admin.html:5592:                
  admin.html:5593:                if (select1) select1.innerHTML = '<option value="">-- No asignar pantalla inicial 
--</option>' + html;
  admin.html:5594:                if (select2) select2.innerHTML = '<option value="">-- No seleccionar / Ignorar 
--</option>' + html;
  admin.html:5595:            }
  admin.html:5596:
  admin.html:5597:            if (storeConfig && storeConfig.sellers) {
  admin.html:5598:                let sellersHtml = '<option value="Página Web Oficial">Página Web Oficial 
(Admin)</option>';
  admin.html:5599:                let sellersRaw = storeConfig.sellers || [];
  admin.html:5600:                let sellers = Array.isArray(sellersRaw) ? sellersRaw : Object.values(sellersRaw || 
{});
  admin.html:5601:                sellers.forEach(s => {
  admin.html:5602:                    if (s && s.name) sellersHtml += `<option value="${s.name}">${s.name}</option>`;
  admin.html:5603:                });
  admin.html:5604:                const seller1 = document.getElementById('manual-client-seller');
  admin.html:5605:                const seller2 = document.getElementById('edit-client-add-seller');
  admin.html:5606:                if (seller1) seller1.innerHTML = sellersHtml;
  admin.html:5607:                if (seller2) seller2.innerHTML = sellersHtml;
  admin.html:5608:            }
  admin.html:5609:        };
  admin.html:5610:
  admin.html:5611:        window.addProductsToExistingClient = async function() {
  admin.html:5612:            if (!currentEditingClientPhone) return alert('Primero busca un cliente para editar.');
  admin.html:5613:            const selectElem = document.getElementById('edit-client-add-product');
  admin.html:5614:            const selectedOptions = Array.from(selectElem.selectedOptions).map(o => 
o.value).filter(v => v !== "");
  admin.html:5615:            
  admin.html:5616:            if (selectedOptions.length === 0) return alert('Selecciona al menos una pantalla en la 
lista.');
  admin.html:5617:
  admin.html:5618:            const name = document.getElementById('edit-client-name').value.trim() || 'Cliente';
  admin.html:5619:            
  admin.html:5620:            const sellerSelect = document.getElementById('edit-client-add-seller');
  admin.html:5621:            const sellerNameRaw = sellerSelect ? sellerSelect.value : 'Página Web Oficial';
  admin.html:5622:            const sellerNameVal = sellerNameRaw.trim();
  admin.html:5623:            
  admin.html:5624:            // Un vendedor es cualquier cosa que no sea la Oficial y que esté en la lista de 
vendedores
  admin.html:5625:            let sellersRaw = storeConfig.sellers || [];
  admin.html:5626:            const sellersList = Array.isArray(sellersRaw) ? sellersRaw : Object.values(sellersRaw);
  admin.html:5627:            const isSellerFound = sellersList.some(s => s.name.trim().toLowerCase() === 
sellerNameVal.toLowerCase());
  admin.html:5628:            const isSellerSale = isSellerFound && !['página web oficial', 'admin', 
'administrador'].includes(sellerNameVal.toLowerCase());
  admin.html:5629:            
  admin.html:5630:            console.log("[DEBUG] Seller Detection:", { raw: sellerNameRaw, val: sellerNameVal, 
isFound: isSellerFound, isSellerSale, sellersListNames: sellersList.map(s => s.name) });
  admin.html:5631:
  admin.html:5632:            // Leer fechas del formulario de nueva venta
  admin.html:5633:            const newSaleStartDateStr = document.getElementById('edit-new-sale-start-date') ? 
document.getElementById('edit-new-sale-start-date').value : '';
  admin.html:5634:            const newSaleEndDateStr   = document.getElementById('edit-new-sale-end-date')   ? 
document.getElementById('edit-new-sale-end-date').value   : '';
  admin.html:5635:            const newSaleEndTimeStr   = document.getElementById('edit-new-sale-end-time')   ? 
document.getElementById('edit-new-sale-end-time').value   : '23:59';
  admin.html:5636:
  admin.html:5637:            const newSaleStart = newSaleStartDateStr
  admin.html:5638:                ? new Date(newSaleStartDateStr + 'T00:00:00').getTime()
  admin.html:5639:                : Date.now();
  admin.html:5640:
  admin.html:5641:            const newSaleEnd = newSaleEndDateStr
  admin.html:5642:                ? new Date(newSaleEndDateStr + 'T' + (newSaleEndTimeStr || '23:59') + 
':00').getTime()
  admin.html:5643:                : Date.now() + (30 * 24 * 60 * 60 * 1000);
  admin.html:5644:
  admin.html:5645:            const saleData = {
  admin.html:5646:                clientName: name,
  admin.html:5647:                clientCity: document.getElementById('edit-client-city').value.trim() || '',
  admin.html:5648:                clientPhone: currentEditingClientPhone,
  admin.html:5649:                date: newSaleStart,
  admin.html:5650:                expirationDate: newSaleEnd,
  admin.html:5651:                items: [],
  admin.html:5652:                total: 0,
  admin.html:5653:                sellerName: sellerNameVal,
  admin.html:5654:                isPaid: !isSellerSale,
  admin.html:5655:                incentiveEarned: 0,
  admin.html:5656:                incentiveDetails: []
  admin.html:5657:            };
  admin.html:5658:
  admin.html:5659:            let individualCount = 0;
  admin.html:5660:            selectedOptions.forEach(prodId => {
  admin.html:5661:                const p = dynamicProducts.find(x => x && x.id && x.id.toString() === 
prodId.toString());
  admin.html:5662:                if (p && p.category && p.category.toLowerCase().includes('individual')) 
individualCount++;
  admin.html:5663:            });
  admin.html:5664:
  admin.html:5665:            console.log("[DEBUG DISCOUNT] Individuals found:", individualCount);
  admin.html:5666:
  admin.html:5667:            selectedOptions.forEach(prodId => {
  admin.html:5668:                const p = dynamicProducts.find(x => x && x.id && x.id.toString() === 
prodId.toString());
  admin.html:5669:                if (p) {
  admin.html:5670:                    const hasSellerPrice = p.sellerPrice && p.sellerPrice > 0;
  admin.html:5671:                    let finalPrice = (isSellerSale && hasSellerPrice) ? p.sellerPrice : p.price;
  admin.html:5672:                    console.log(`[DEBUG] Price for ${p.name}:`, { isSellerSale, hasSellerPrice, 
sellerPrice: p.sellerPrice, adminPrice: p.price, chosen: finalPrice });
  admin.html:5673:                    if (individualCount >= 2 && (p.category || 
'').toLowerCase().includes('individual')) {
  admin.html:5674:                        let disc = 1000;
  admin.html:5675:                        if (saleData.sellerName !== 'Página Web Oficial' && 
storeConfig.sellerDiscountAmount > 0) disc = storeConfig.sellerDiscountAmount;
  admin.html:5676:                        else if (saleData.sellerName === 'Página Web Oficial' && 
storeConfig.discountAmount > 0) disc = storeConfig.discountAmount;
  admin.html:5677:                        finalPrice -= disc;
  admin.html:5678:                    }
  admin.html:5679:
  admin.html:5680:                    // Recolectar emails específicos para este item
  admin.html:5681:                    const itemEmails = [];
  admin.html:5682:                    document.querySelectorAll(`#edit-add-emails-list 
.manual-email-group[data-prod-id="${p.id}"]`).forEach(group => {
  admin.html:5683:                        itemEmails.push({
  admin.html:5684:                            platform: group.querySelector('.manual-platform-input').value.trim(),
  admin.html:5685:                            email: group.querySelector('.manual-email-input').value.trim()
  admin.html:5686:                        });
  admin.html:5687:                    });
  admin.html:5688:
  admin.html:5689:                    // Recolectar alias para este producto
  admin.html:5690:                    const aliasInput = document.querySelector(`#edit-add-emails-list 
.manual-alias-input[data-prod-id="${p.id}"]`);
  admin.html:5691:                    const customName = aliasInput ? aliasInput.value.trim() : null;
  admin.html:5692:
  admin.html:5693:                    saleData.items.push({
  admin.html:5694:                        id: p.id,
  admin.html:5695:                        name: p.name,
  admin.html:5696:                        customName: customName || null,
  admin.html:5697:                        category: p.category,
  admin.html:5698:                        finalPrice: finalPrice,
  admin.html:5699:                        specificEmails: itemEmails
  admin.html:5700:                    });
  admin.html:5701:                    saleData.total += finalPrice;
  admin.html:5702:
  admin.html:5703:                    // Cálculo de Incentivos (Bonos) SOLO PARA VENDEDORES
  admin.html:5704:                    if (isSellerSale && (storeConfig.incentiveEnabled == true || 
storeConfig.incentiveEnabled == 'true')) {
  admin.html:5705:                        let itemBono = 0;
  admin.html:5706:                        let itemBonoNombre = '';
  admin.html:5707:                        const prodCat = (p.category || '').toLowerCase().trim();
  admin.html:5708:                        const prodMarca = ((p.brand || '') + ' ' + (p.name || '')).toLowerCase();
  admin.html:5709:
  admin.html:5710:                        const cleanCat = prodCat.replace(/[\s\-_]/g, '');
  admin.html:5711:                        if (cleanCat.includes('individual') || cleanCat.includes('ventasextras')) {
  admin.html:5712:                            if (prodMarca.includes('privada')) { itemBono = 
parseInt(storeConfig.incentiveNetflixPrivada) || 0; itemBonoNombre = 'Netflix Privada'; }
  admin.html:5713:                            else if (prodMarca.includes('netflix')) { itemBono = 
parseInt(storeConfig.incentiveNetflix) || 0; itemBonoNombre = 'Netflix'; }
  admin.html:5714:                            else if (prodMarca.includes('disney')) { itemBono = 
parseInt(storeConfig.incentiveDisney) || 0; itemBonoNombre = 'Disney+'; }
  admin.html:5715:                            else if (prodMarca.includes('max') || prodMarca.includes('hbo')) { 
itemBono = parseInt(storeConfig.incentiveMax) || 0; itemBonoNombre = 'HBO Max'; }
  admin.html:5716:                            else if (prodMarca.includes('prime')) { itemBono = 
parseInt(storeConfig.incentivePrime) || 0; itemBonoNombre = 'Prime Video'; }
  admin.html:5717:                            else if (prodMarca.includes('paramount')) { itemBono = 
parseInt(storeConfig.incentiveParamount) || 0; itemBonoNombre = 'Paramount+'; }
  admin.html:5718:                            else if (prodMarca.includes('vix')) { itemBono = 
parseInt(storeConfig.incentiveVix) || 0; itemBonoNombre = 'Vix'; }
  admin.html:5719:                            else if (prodMarca.includes('iptv')) { itemBono = 
parseInt(storeConfig.incentiveIptv) || 0; itemBonoNombre = 'IPTV'; }
  admin.html:5720:                            else if (prodMarca.includes('crunchyroll')) { itemBono = 
parseInt(storeConfig.incentiveCrunchyroll) || 0; itemBonoNombre = 'Crunchyroll'; }
  admin.html:5721:                            else if (prodMarca.includes('apple')) { itemBono = 
parseInt(storeConfig.incentiveApple) || 0; itemBonoNombre = 'Apple TV'; }
  admin.html:5722:                        }
  admin.html:5723:                        else if (cleanCat.includes('combo')) {
  admin.html:5724:                            const combinedMatch = (cleanCat + prodMarca).replace(/[\s\-_]/g, '');
  admin.html:5725:                            if (combinedMatch.includes('combo2') || 
combinedMatch.includes('combos2')) { itemBono = parseInt(storeConfig.incentiveCombo2) || 0; itemBonoNombre = 'Combo 2 
P.'; }
  admin.html:5726:                            else if (combinedMatch.includes('combo3') || 
combinedMatch.includes('combos3')) { itemBono = parseInt(storeConfig.incentiveCombo3) || 0; itemBonoNombre = 'Combo 3 
P.'; }
  admin.html:5727:                            else if (combinedMatch.includes('combo4') || 
combinedMatch.includes('combos4')) { itemBono = parseInt(storeConfig.incentiveCombo4) || 0; itemBonoNombre = 'Combo 4 
P.'; }
  admin.html:5728:                            else if (combinedMatch.includes('combo5') || 
combinedMatch.includes('combos5')) { itemBono = parseInt(storeConfig.incentiveCombo5) || 0; itemBonoNombre = 'Combo 5+ 
P.'; }
  admin.html:5729:                            else {
  admin.html:5730:                                // Fallback: try to guess from product title if category is just 
"Combos"
  admin.html:5731:                                if (prodMarca.includes('2pantalla')) { itemBono = 
parseInt(storeConfig.incentiveCombo2) || 0; itemBonoNombre = 'Combo 2 P.'; }
  admin.html:5732:                                else if (prodMarca.includes('3pantalla')) { itemBono = 
parseInt(storeConfig.incentiveCombo3) || 0; itemBonoNombre = 'Combo 3 P.'; }
  admin.html:5733:                                else if (prodMarca.includes('4pantalla')) { itemBono = 
parseInt(storeConfig.incentiveCombo4) || 0; itemBonoNombre = 'Combo 4 P.'; }
  admin.html:5734:                                else if (prodMarca.includes('5pantalla')) { itemBono = 
parseInt(storeConfig.incentiveCombo5) || 0; itemBonoNombre = 'Combo 5+ P.'; }
  admin.html:5735:                            }
  admin.html:5736:                        }
  admin.html:5737:                        else if (cleanCat.includes('promo') || cleanCat.includes('promocion')) {
  admin.html:5738:                            if (cleanCat.includes('finde')) { itemBono = 
parseInt(storeConfig.incentiveFinde) || 0; itemBonoNombre = 'Promo Finde'; }
  admin.html:5739:                            else { itemBono = parseInt(storeConfig.incentiveMes) || 0; 
itemBonoNombre = 'Promo Mes'; }
  admin.html:5740:                        }
  admin.html:5741:                        
  admin.html:5742:                        console.log(`[DEBUG] Bono search for ${p.name}:`, { cat: prodCat, clean: 
cleanCat, marca: prodMarca, configVal: storeConfig.incentiveCombo2, calculated: itemBono });
  admin.html:5743:
  admin.html:5744:                        if (itemBono > 0) {
  admin.html:5745:                            saleData.incentiveEarned += itemBono;
  admin.html:5746:                            saleData.incentiveDetails.push(itemBonoNombre + ' (+$' + itemBono + ')');
  admin.html:5747:                        }
  admin.html:5748:                    }
  admin.html:5749:                }
  admin.html:5750:            });
  admin.html:5751:
  admin.html:5752:            if (saleData.items.length > 0) {
  admin.html:5753:                try {
  admin.html:5754:                    await db.ref(`clientSales/${currentEditingClientPhone}`).push(saleData);
  admin.html:5755:                    await db.ref(`sellerSales/${saleData.sellerName}`).push(saleData);
  admin.html:5756:                    let catDebug = saleData.items.map(i => i.category || 'SIN_CATEGORIA').join(', ');
  admin.html:5757:                    let combo2Val = storeConfig.incentiveCombo2;
  admin.html:5758:                    let enabledFlag = storeConfig.incentiveEnabled ? 'ACTIVADO' : 'APAGADO';
  admin.html:5759:                    let statusText = saleData.isPaid ? 'PAGADO' : 'PENDIENTE';
  admin.html:5760:                    let bonusMsg = isSellerSale ? (saleData.incentiveEarned > 0 ? `\n💰 Bono sumado: 
$${saleData.incentiveEarned} (${saleData.incentiveDetails.join(', ')})` : `\n⚠️ Atención: Esta venta NO acumuló bono 
(verifica categorías o marcas en los productos).`) : '';
  admin.html:5761:                    alert(`¡Acción completada!` + bonusMsg);
  admin.html:5762:                    window.location.reload();
  admin.html:5763:                } catch(e) {
  admin.html:5764:                    alert('Error añadiendo pantallas: ' + e.message);
  admin.html:5765:                }
  admin.html:5766:            }
  admin.html:5767:        };
  admin.html:5768:
  admin.html:5769:        window.createClientManual = async function() {
  admin.html:5770:            const name = document.getElementById('manual-client-name').value.trim();
  admin.html:5771:            const phoneStr = 
window.sanitizePhone(document.getElementById('manual-client-phone').value);
  admin.html:5772:            const pinStr = document.getElementById('manual-client-pin').value.trim();
  admin.html:5773:            const emailStr = document.getElementById('manual-client-email') ? 
document.getElementById('manual-client-email').value.trim() : '';
  admin.html:5774:            const startDateStr = document.getElementById('manual-client-start-date').value;
  admin.html:5775:            const endDateStr = document.getElementById('manual-client-end-date').value;
  admin.html:5776:            const selectElem = document.getElementById('manual-client-product');
  admin.html:5777:            const selectedOptions = Array.from(selectElem.selectedOptions).map(o => 
o.value).filter(v => v !== "");
  admin.html:5778:
  admin.html:5779:            if (!name) return alert('Debes ingresar el nombre del cliente.');
  admin.html:5780:            if (!phoneStr || phoneStr.length < 5) return alert('Debes ingresar un número válido.');
  admin.html:5781:
  admin.html:5782:            try {
  admin.html:5783:                // Register Client Profile first
  admin.html:5784:                await db.ref(`clientProfiles/${phoneStr}`).update({ name: name });
  admin.html:5785:
  admin.html:5786:                // Variables de incentivos (Uso directo sobre saleData luego)
  admin.html:5787:
  admin.html:5788:                const sellerSelect = document.getElementById('manual-client-seller');
  admin.html:5789:                const sellerNameRaw = sellerSelect ? sellerSelect.value : 'Página Web Oficial';
  admin.html:5790:                const sellerNameVal = sellerNameRaw.trim();
  admin.html:5791:                
  admin.html:5792:                let sellersRaw = storeConfig.sellers || [];
  admin.html:5793:                const sellersList = Array.isArray(sellersRaw) ? sellersRaw : 
Object.values(sellersRaw);
  admin.html:5794:                const isSellerFound = sellersList.some(s => s.name.trim().toLowerCase() === 
sellerNameVal.toLowerCase());
  admin.html:5795:                const isSellerSale = isSellerFound && !['página web oficial', 'admin', 
'administrador'].includes(sellerNameVal.toLowerCase());
  admin.html:5796:                
  admin.html:5797:                console.log("[DEBUG] Manual Create Seller Detection:", { raw: sellerNameRaw, val: 
sellerNameVal, isFound: isSellerFound, isSellerSale, sellersListNames: sellersList.map(s => s.name) });
  admin.html:5798:
  admin.html:5799:                const saleData = {
  admin.html:5800:                    clientName: name,
  admin.html:5801:                    clientCity: '',
  admin.html:5802:                    clientPhone: phoneStr,
  admin.html:5803:                    date: startDateStr ? new Date(startDateStr + 'T12:00:00').getTime() : Date.now(),
  admin.html:5804:                    expirationDate: endDateStr ? new Date(endDateStr + 'T' + 
(document.getElementById('manual-client-end-time').value || '23:59')).getTime() : 
window.DPCBillingEngine.calcularProximoVencimiento(Date.now(), Date.now()).getTime(),
  admin.html:5805:                    fechaCompraOriginal: Date.now(),
  admin.html:5806:                    items: [],
  admin.html:5807:                    total: 0,
  admin.html:5808:                    sellerName: sellerNameVal,
  admin.html:5809:                    isPaid: !isSellerSale,
  admin.html:5810:                    incentiveEarned: 0,
  admin.html:5811:                    incentiveDetails: [],
  admin.html:5812:                    email: null,
  admin.html:5813:                };
  admin.html:5814:
  admin.html:5815:                if (selectedOptions.length > 0) {
  admin.html:5816:                    let individualCount = 0;
  admin.html:5817:                    selectedOptions.forEach(prodId => {
  admin.html:5818:                        const p = dynamicProducts.find(x => x && x.id && x.id.toString() === 
prodId.toString());
  admin.html:5819:                        if (p && p.category && p.category.toLowerCase().includes('individual')) 
individualCount++;
  admin.html:5820:                    });
  admin.html:5821:
  admin.html:5822:                    console.log("[DEBUG DISCOUNT] Individuals found (Manual Create):", 
individualCount);
  admin.html:5823:
  admin.html:5824:                    selectedOptions.forEach(prodId => {
  admin.html:5825:                        const p = dynamicProducts.find(x => x && x.id && x.id.toString() === 
prodId.toString());
  admin.html:5826:                        if (p) {
  admin.html:5827:                            const hasSellerPrice = p.sellerPrice && p.sellerPrice > 0;
  admin.html:5828:                            let finalPrice = (isSellerSale && hasSellerPrice) ? p.sellerPrice : 
p.price;
  admin.html:5829:                            console.log(`[DEBUG] Manual Price for ${p.name}:`, { isSellerSale, 
hasSellerPrice, sellerPrice: p.sellerPrice, adminPrice: p.price, chosen: finalPrice });
  admin.html:5830:                            if (individualCount >= 2 && (p.category || 
'').toLowerCase().includes('individual')) {
  admin.html:5831:                                let disc = 1000;
  admin.html:5832:                                if (saleData.sellerName !== 'Página Web Oficial' && 
storeConfig.sellerDiscountAmount > 0) disc = storeConfig.sellerDiscountAmount;
  admin.html:5833:                                else if (saleData.sellerName === 'Página Web Oficial' && 
storeConfig.discountAmount > 0) disc = storeConfig.discountAmount;
  admin.html:5834:                                
  admin.html:5835:                                finalPrice -= disc;
  admin.html:5836:                                console.log(`[DEBUG DISCOUNT] Applied ${disc} discount to ${p.name}. 
Final: ${finalPrice}`);
  admin.html:5837:                            }
  admin.html:5838:
  admin.html:5839:                            // Recolectar emails específicos para este item
  admin.html:5840:                            const itemEmails = [];
  admin.html:5841:                            document.querySelectorAll(`#manual-emails-list 
.manual-email-group[data-prod-id="${p.id}"]`).forEach(group => {
  admin.html:5842:                                itemEmails.push({
  admin.html:5843:                                    platform: 
group.querySelector('.manual-platform-input').value.trim(),
  admin.html:5844:                                    email: group.querySelector('.manual-email-input').value.trim()
  admin.html:5845:                                });
  admin.html:5846:                            });
  admin.html:5847:
  admin.html:5848:                            // Recolectar alias para este producto
  admin.html:5849:                            const aliasInput = document.querySelector(`#manual-emails-list 
.manual-alias-input[data-prod-id="${p.id}"]`);
  admin.html:5850:                            const customName = aliasInput ? aliasInput.value.trim() : null;
  admin.html:5851:
  admin.html:5852:                            saleData.items.push({
  admin.html:5853:                                id: p.id,
  admin.html:5854:                                name: p.name,
  admin.html:5855:                                customName: customName || null,
  admin.html:5856:                                category: p.category,
  admin.html:5857:                                finalPrice: finalPrice,
  admin.html:5858:                                specificEmails: itemEmails
  admin.html:5859:                            });
  admin.html:5860:                            saleData.total += finalPrice;
  admin.html:5861:
  admin.html:5862:                            // Cálculo de Incentivos (Bonos) SOLO PARA VENDEDORES
  admin.html:5863:                            if (isSellerSale && (storeConfig.incentiveEnabled == true || 
storeConfig.incentiveEnabled == 'true')) {
  admin.html:5864:                                let itemBono = 0;
  admin.html:5865:                                let itemBonoNombre = '';
  admin.html:5866:                                const prodCat = (p.category || '').toLowerCase().trim();
  admin.html:5867:                                const prodMarca = ((p.brand || '') + ' ' + (p.name || 
'')).toLowerCase();
  admin.html:5868:
  admin.html:5869:                                const cleanCat = prodCat.replace(/[\s\-_]/g, '');
  admin.html:5870:                                // Bloque Individuales
  admin.html:5871:                                if (cleanCat.includes('individual') || 
cleanCat.includes('ventasextras')) {
  admin.html:5872:                                    if (prodMarca.includes('privada')) { itemBono = 
parseInt(storeConfig.incentiveNetflixPrivada) || 0; itemBonoNombre = 'Netflix Privada'; }
  admin.html:5873:                                    else if (prodMarca.includes('netflix')) { itemBono = 
parseInt(storeConfig.incentiveNetflix) || 0; itemBonoNombre = 'Netflix'; }
  admin.html:5874:                                    else if (prodMarca.includes('disney')) { itemBono = 
parseInt(storeConfig.incentiveDisney) || 0; itemBonoNombre = 'Disney+'; }
  admin.html:5875:                                    else if (prodMarca.includes('max') || prodMarca.includes('hbo')) 
{ itemBono = parseInt(storeConfig.incentiveMax) || 0; itemBonoNombre = 'HBO Max'; }
  admin.html:5876:                                    else if (prodMarca.includes('prime')) { itemBono = 
parseInt(storeConfig.incentivePrime) || 0; itemBonoNombre = 'Prime Video'; }
  admin.html:5877:                                    else if (prodMarca.includes('paramount')) { itemBono = 
parseInt(storeConfig.incentiveParamount) || 0; itemBonoNombre = 'Paramount+'; }
  admin.html:5878:                                    else if (prodMarca.includes('vix')) { itemBono = 
parseInt(storeConfig.incentiveVix) || 0; itemBonoNombre = 'Vix'; }
  admin.html:5879:                                    else if (prodMarca.includes('iptv')) { itemBono = 
parseInt(storeConfig.incentiveIptv) || 0; itemBonoNombre = 'IPTV'; }
  admin.html:5880:                                    else if (prodMarca.includes('crunchyroll')) { itemBono = 
parseInt(storeConfig.incentiveCrunchyroll) || 0; itemBonoNombre = 'Crunchyroll'; }
  admin.html:5881:                                    else if (prodMarca.includes('apple')) { itemBono = 
parseInt(storeConfig.incentiveApple) || 0; itemBonoNombre = 'Apple TV'; }
  admin.html:5882:                                }
  admin.html:5883:                                // Bloque Combos
  admin.html:5884:                                else if (cleanCat.includes('combo')) {
  admin.html:5885:                                    const combinedMatch = (cleanCat + prodMarca).replace(/[\s\-_]/g, 
'');
  admin.html:5886:                                    if (combinedMatch.includes('combo2') || 
combinedMatch.includes('combos2')) { itemBono = parseInt(storeConfig.incentiveCombo2) || 0; itemBonoNombre = 'Combo 2 
P.'; }
  admin.html:5887:                                    else if (combinedMatch.includes('combo3') || 
combinedMatch.includes('combos3')) { itemBono = parseInt(storeConfig.incentiveCombo3) || 0; itemBonoNombre = 'Combo 3 
P.'; }
  admin.html:5888:                                    else if (combinedMatch.includes('combo4') || 
combinedMatch.includes('combos4')) { itemBono = parseInt(storeConfig.incentiveCombo4) || 0; itemBonoNombre = 'Combo 4 
P.'; }
  admin.html:5889:                                    else if (combinedMatch.includes('combo5') || 
combinedMatch.includes('combos5')) { itemBono = parseInt(storeConfig.incentiveCombo5) || 0; itemBonoNombre = 'Combo 5+ 
P.'; }
  admin.html:5890:                                    else {
  admin.html:5891:                                        if (prodMarca.includes('2pantalla')) { itemBono = 
parseInt(storeConfig.incentiveCombo2) || 0; itemBonoNombre = 'Combo 2 P.'; }
  admin.html:5892:                                        else if (prodMarca.includes('3pantalla')) { itemBono = 
parseInt(storeConfig.incentiveCombo3) || 0; itemBonoNombre = 'Combo 3 P.'; }
  admin.html:5893:                                        else if (prodMarca.includes('4pantalla')) { itemBono = 
parseInt(storeConfig.incentiveCombo4) || 0; itemBonoNombre = 'Combo 4 P.'; }
  admin.html:5894:                                        else if (prodMarca.includes('5pantalla')) { itemBono = 
parseInt(storeConfig.incentiveCombo5) || 0; itemBonoNombre = 'Combo 5+ P.'; }
  admin.html:5895:                                    }
  admin.html:5896:                                }
  admin.html:5897:                                // Bloque Promos
  admin.html:5898:                                else if (cleanCat.includes('promo') || 
cleanCat.includes('promocion')) {
  admin.html:5899:                                    if (cleanCat.includes('finde')) { itemBono = 
parseInt(storeConfig.incentiveFinde) || 0; itemBonoNombre = 'Promo Finde'; }
  admin.html:5900:                                    else { itemBono = parseInt(storeConfig.incentiveMes) || 0; 
itemBonoNombre = 'Promo Mes'; }
  admin.html:5901:                                }
  admin.html:5902:
  admin.html:5903:                                if (itemBono > 0) {
  admin.html:5904:                                    saleData.incentiveEarned += itemBono;
  admin.html:5905:                                    saleData.incentiveDetails.push(itemBonoNombre + ' (+$' + 
itemBono + ')');
  admin.html:5906:                                }
  admin.html:5907:                            }
  admin.html:5908:                        }
  admin.html:5909:                    });
  admin.html:5910:                }
  admin.html:5911:
  admin.html:5912:                // Guardar como venta inicial si se seleccionó producto, o registro vacío si no
  admin.html:5913:                if (saleData.items.length > 0) {
  admin.html:5914:                    await db.ref(`clientSales/${phoneStr}`).push(saleData);
  admin.html:5915:                    await db.ref(`sellerSales/${saleData.sellerName}`).push(saleData);
  admin.html:5916:                    
  admin.html:5917:                    let catDebug = saleData.items.map(i => i.category || 'SIN_CATEGORIA').join(', ');
  admin.html:5918:                    let combo2Val = storeConfig.incentiveCombo2;
  admin.html:5919:                    let enabledFlag = storeConfig.incentiveEnabled ? 'SI' : 'NO';
  admin.html:5920:                    let statusText = saleData.isPaid ? 'PAGADO' : 'PENDIENTE';
  admin.html:5921:                    let bonusMsg = isSellerSale ? (saleData.incentiveEarned > 0 ? `\n💰 Bono sumado: 
$${saleData.incentiveEarned} (${saleData.incentiveDetails.join(', ')})` : `\n⚠️ Atención: Esta venta NO acumuló bono 
(verifica categorías o marcas en los productos).`) : '';
  admin.html:5922:                    alert(`¡Cliente '${name}' registrado!` + bonusMsg);
  admin.html:5923:                } else {
  admin.html:5924:                    alert(`¡Cliente '${name}' registrado en la DB exitosamente sin compras 
activas!`);
  admin.html:5925:                }
  admin.html:5926:
  admin.html:5927:                if (pinStr) {
  admin.html:5928:                    await db.ref(`clientProfiles/${phoneStr}/pin`).set(pinStr);
  admin.html:5929:                }
  admin.html:5930:                
  admin.html:5931:                window.location.reload();
  admin.html:5932:
  admin.html:5933:            } catch(e) {
  admin.html:5934:                alert('Error al crear el cliente: ' + e.message);
  admin.html:5935:            }
  admin.html:5936:        };
  admin.html:5937:    </script>
  admin.html:5938:</body>
  admin.html:5939:</html>


