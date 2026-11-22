const apiUrl = "/api/proveedores";
const notice = document.querySelector("#notice");
const menuButton = document.querySelector("#providers-menu-button");
const menu = document.querySelector("#providers-menu");
const supplierList = document.querySelector("#supplier-list");
const supplierCount = document.querySelector("#supplier-count");
const viewTitles = {
    inicio: ["Gestión de proveedores", "Administra la información de los proveedores de la tienda."],
    crear: ["Adicionar proveedor", "Completa los datos para registrar un proveedor."],
    listar: ["Listar proveedores", "Consulta los proveedores registrados."],
    consultar: ["Consultar proveedor", "Busca un proveedor por su código o NIT."],
    actualizar: ["Actualizar proveedor", "Busca un registro y modifica sus datos."],
    eliminar: ["Eliminar proveedor", "Localiza un registro antes de confirmar su eliminación."]
};

async function request(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        let message = `La solicitud falló (${response.status}).`;
        try {
            const body = await response.json();
            if (typeof body.detail === "string") message = body.detail;
            else if (typeof body.message === "string") message = body.message;
        } catch {
            // Conserva el mensaje HTTP cuando la respuesta no incluye JSON.
        }
        throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
}

function showNotice(message, isError = false) {
    notice.textContent = message;
    notice.className = isError ? "notice error" : "notice";
    notice.hidden = false;
}

function hideNotice() {
    notice.hidden = true;
    notice.textContent = "";
    notice.className = "notice";
}

function setView(view) {
    if (!Object.prototype.hasOwnProperty.call(viewTitles, view)) return;
    for (const [name] of Object.entries(viewTitles)) {
        document.querySelector(`#view-${name}`).hidden = name !== view;
    }

    document.querySelector("#view-title").textContent = viewTitles[view][0];
    document.querySelector("#view-description").textContent = viewTitles[view][1];
    document.querySelector("#view-eyebrow").textContent = view === "inicio" ? "Bienvenido" : "Administración";
    document.querySelector("#active-view").textContent = view === "inicio" ? "INICIO" : viewTitles[view][0].toLocaleUpperCase("es");
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    hideNotice();

    if (view === "listar") loadSuppliers();
}

function createCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value === null || value === undefined || value === "" ? "—" : String(value);
    row.append(cell);
    return cell;
}

function createAction(label, className, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `button ${className}`;
    button.textContent = label;
    button.addEventListener("click", action);
    return button;
}

function renderSuppliers(suppliers) {
    supplierList.replaceChildren();

    if (suppliers.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.className = "table-message";
        cell.textContent = "No se encontraron proveedores.";
        row.append(cell);
        supplierList.append(row);
        return;
    }

    for (const supplier of suppliers) {
        const row = document.createElement("tr");
        createCell(row, supplier.codigo);
        createCell(row, supplier.nombre);
        createCell(row, supplier.nit);

        const contact = document.createElement("td");
        const email = document.createElement("div");
        email.textContent = supplier.correo || "—";
        const phone = document.createElement("small");
        phone.textContent = supplier.telefono || "Sin teléfono";
        contact.append(email, phone);
        row.append(contact);

        createCell(row, supplier.idInstrumento);
        supplierList.append(row);
    }
}

async function loadSuppliers(name = "") {
    const loadingRow = document.createElement("tr");
    const loadingCell = document.createElement("td");
    loadingCell.colSpan = 5;
    loadingCell.className = "table-message";
    loadingCell.textContent = "Cargando proveedores...";
    loadingRow.append(loadingCell);
    supplierList.replaceChildren(loadingRow);
    hideNotice();

    try {
        const url = new URL(apiUrl, window.location.origin);
        if (name.trim()) url.searchParams.set("nombre", name.trim());
        const suppliers = await request(url);
        if (!Array.isArray(suppliers)) throw new Error("El servicio devolvió una lista de proveedores inválida.");
        renderSuppliers(suppliers);
        if (!name.trim()) supplierCount.textContent = suppliers.length.toLocaleString("es");
    } catch (error) {
        supplierCount.textContent = "—";
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.className = "table-message";
        cell.textContent = error.message;
        row.append(cell);
        supplierList.replaceChildren(row);
        showNotice("No fue posible cargar los proveedores. Verifica que el servicio esté disponible.", true);
    }
}

async function refreshCount() {
    try {
        const suppliers = await request(apiUrl);
        if (!Array.isArray(suppliers)) throw new Error("El servicio devolvió una lista de proveedores inválida.");
        supplierCount.textContent = suppliers.length.toLocaleString("es");
    } catch (error) {
        supplierCount.textContent = "—";
        showNotice(`No se pudo consultar el servicio de proveedores: ${error.message}`, true);
    }
}

function formPayload(form) {
    const data = new FormData(form);
    const optionalValue = (name) => String(data.get(name) || "").trim() || null;
    return {
        codigo: Number(data.get("codigo")),
        nombre: String(data.get("nombre")).trim(),
        nit: String(data.get("nit")).trim(),
        correo: String(data.get("correo")).trim(),
        telefono: optionalValue("telefono"),
        direccion: optionalValue("direccion"),
        idInstrumento: Number(data.get("idInstrumento"))
    };
}

function bindDigitsOnly(selector, { maxLength, positive = false }) {
    for (const input of document.querySelectorAll(selector)) {
        input.addEventListener("input", () => {
            let digits = input.value.replace(/\D/g, "").slice(0, maxLength);
            if (positive) digits = digits.replace(/^0+/, "");
            input.value = digits;
        });
    }
}

function populateUpdateForm(supplier) {
    const form = document.querySelector("#update-form");
    for (const field of ["codigo", "nombre", "nit", "correo", "telefono", "direccion", "idInstrumento"]) {
        form.elements[field].value = supplier[field] ?? "";
    }
    form.hidden = false;
}

function appendDetail(list, label, value) {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = value === null || value === undefined || value === "" ? "—" : String(value);
    wrapper.append(term, description);
    list.append(wrapper);
}

function createSupplierCard(supplier) {
    const card = document.createElement("article");
    card.className = "supplier-card";
    const heading = document.createElement("h3");
    heading.textContent = supplier.nombre;
    const details = document.createElement("dl");
    details.className = "supplier-details";
    appendDetail(details, "Código", supplier.codigo);
    appendDetail(details, "NIT", supplier.nit);
    appendDetail(details, "Correo electrónico", supplier.correo);
    appendDetail(details, "Teléfono", supplier.telefono);
    appendDetail(details, "Dirección", supplier.direccion);
    appendDetail(details, "ID del instrumento", supplier.idInstrumento);
    appendDetail(details, "ObjectId del instrumento", supplier.objectIdInstrumento);
    card.append(heading, details);
    return card;
}

function showDeleteResult(supplier) {
    setView("eliminar");
    const result = document.querySelector("#delete-result");
    const card = createSupplierCard(supplier);
    const actions = document.createElement("div");
    actions.className = "button-row result-actions";
    actions.append(
        createAction("Confirmar eliminación", "button-danger", () => deleteSupplier(supplier)),
        createAction("Cancelar", "button-secondary", () => {
            result.hidden = true;
            result.replaceChildren();
        })
    );
    card.append(actions);
    result.replaceChildren(card);
    result.hidden = false;
}

async function findSupplierByCode(value) {
    const code = Number(value);
    if (!Number.isInteger(code) || code <= 0) {
        throw new Error("Ingresa un código de proveedor válido.");
    }
    return request(`${apiUrl}/${encodeURIComponent(code)}`);
}

async function deleteSupplier(supplier) {
    const confirmed = window.confirm(`¿Eliminar al proveedor "${supplier.nombre}" (código ${supplier.codigo})? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    try {
        await request(`${apiUrl}/${encodeURIComponent(supplier.codigo)}`, { method: "DELETE" });
        document.querySelector("#delete-result").hidden = true;
        document.querySelector("#delete-result").replaceChildren();
        showNotice("Proveedor eliminado correctamente.");
        await refreshCount();
    } catch (error) {
        showNotice(error.message, true);
    }
}

menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menu.hidden = isExpanded;
});

document.querySelector("#home-button").addEventListener("click", () => setView("inicio"));
document.querySelector("#home-manage").addEventListener("click", () => setView("listar"));
document.querySelector("#home-create").addEventListener("click", () => setView("crear"));
bindDigitsOnly("#create-nit, #update-nit", { maxLength: 30, positive: true });
bindDigitsOnly("#create-telefono, #update-telefono", { maxLength: 15 });

menu.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-view]");
    if (button) setView(button.dataset.view);
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".menu-wrapper")) {
        menu.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        menu.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
    }
});

document.querySelector("#create-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    try {
        await request(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formPayload(form))
        });
        form.reset();
        showNotice("Proveedor creado correctamente.");
        void refreshCount();
    } catch (error) {
        showNotice(error.message, true);
    }
});

document.querySelector("#list-search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    loadSuppliers(document.querySelector("#list-search-name").value);
});

document.querySelector("#list-clear-search").addEventListener("click", () => {
    document.querySelector("#list-search-name").value = "";
    loadSuppliers();
});

document.querySelector("#list-refresh").addEventListener("click", () => {
    loadSuppliers(document.querySelector("#list-search-name").value);
});

document.querySelector("#consult-by").addEventListener("change", (event) => {
    const input = document.querySelector("#consult-value");
    input.type = event.target.value === "codigo" ? "number" : "text";
    input.min = event.target.value === "codigo" ? "1" : "";
    input.step = event.target.value === "codigo" ? "1" : "";
    input.placeholder = event.target.value === "codigo" ? "Código del proveedor" : "NIT del proveedor";
});

document.querySelector("#consult-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const key = document.querySelector("#consult-by").value;
    const value = document.querySelector("#consult-value").value.trim();
    const result = document.querySelector("#consult-result");
    result.hidden = true;
    hideNotice();
    try {
        const supplier = key === "codigo"
            ? await findSupplierByCode(value)
            : await request(`${apiUrl}/buscar?nit=${encodeURIComponent(value)}`);
        result.replaceChildren(createSupplierCard(supplier));
        result.hidden = false;
    } catch (error) {
        showNotice(error.message, true);
    }
});

document.querySelector("#update-lookup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = document.querySelector("#update-codigo-search").value;
    const form = document.querySelector("#update-form");
    form.hidden = true;
    hideNotice();
    try {
        populateUpdateForm(await findSupplierByCode(value));
    } catch (error) {
        showNotice(error.message, true);
    }
});

document.querySelector("#update-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const payload = formPayload(form);
    try {
        await request(`${apiUrl}/${encodeURIComponent(payload.codigo)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        await refreshCount();
        setView("listar");
        showNotice("Proveedor actualizado correctamente.");
    } catch (error) {
        showNotice(error.message, true);
    }
});

document.querySelector("#update-cancel").addEventListener("click", () => {
    document.querySelector("#update-form").hidden = true;
    setView("listar");
});

document.querySelector("#delete-lookup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = document.querySelector("#delete-codigo-search").value;
    const result = document.querySelector("#delete-result");
    result.hidden = true;
    hideNotice();
    try {
        showDeleteResult(await findSupplierByCode(value));
    } catch (error) {
        showNotice(error.message, true);
    }
});

refreshCount();
setView("inicio");
