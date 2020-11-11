function genInput(id, idata, change) {
    var ediv = document.createElement("div")
    var elabel = document.createElement("label")
    var einput = document.createElement("input")
    var espan = document.createElement("span")

    elabel.setAttribute("for", id)
    einput.id = id;
    einput.type = "number"
    elabel.innerHTML = (idata.comment) ? (idata.comment + ": " + idata.label) : idata.label
    espan.innerHTML = idata.unit
    einput.onchange = () => {
        change(einput.value)
    }
    ediv.append(elabel, einput, espan)
    return ediv
}

function genInputs(form, vars, update) {
    var ediv = document.createElement("div")
    for (const iid in form.inputs) {
        if (form.inputs.hasOwnProperty(iid)) {
            const i = form.inputs[iid];
            ediv.appendChild(genInput(iid, i, (v) => {
                vars[iid] = v
                update()
            }))
        }
    }
    return ediv
}


function substDisplay(i,o,vars) {
    var os = o.display
    for (const iid in i) {
        if (i.hasOwnProperty(iid)) {
            var ti = i[iid]
            var re = vars ? (displayValue(vars[iid]) + ti.unit) : ti.label
            
            os = os.replace(`{v/${iid}}`, re)
        }
    }
    return os
}

function displayValue(v) {
    return v.toString()
}

function genOutput(form, vars, oid) {
    var ediv = document.createElement("div")
    ediv.classList.add("out-steps")
    var o = form.outputs[oid]
    var update = () => {
        ediv.innerHTML = ""
        var estep_header = document.createElement("h3")
        var estep_form = document.createElement("p")
        var estep_subst = document.createElement("p")
        var estep_solution = document.createElement("p")
        var osym = o.label
        estep_header.innerHTML = o.comment
        estep_form.innerHTML = osym + " = " + substDisplay(form.inputs,o,undefined)
        estep_subst.innerHTML = osym + " = " + substDisplay(form.inputs,o,vars)
        estep_solution.innerHTML = osym + " = " + displayValue(o.calc(vars)) + o.unit
        ediv.append(estep_header,estep_form, estep_subst, estep_solution)
    }
    update()
    return [ediv, update]
}

function genOutputs(form,vars) {
    var ediv = document.createElement("div")
    var updaters = []
    var update = () => {
        updaters.forEach(u=>u())
    }
    console.log(form.outputs);
    for (const oid in form.outputs) {
        if (form.outputs.hasOwnProperty(oid)) {
            console.log(oid);
            var [ndiv,nupdate] = genOutput(form,vars,oid)
            updaters.push(nupdate)
            ediv.appendChild(ndiv)
        }
    }
    return [ediv,update]
}

function genForm(form) {
    var ediv = document.createElement("div")
    var eheader = document.createElement("h2")
    var ecomment = document.createElement("p")
    eheader.textContent = form.name
    ecomment.innerHTML = form.comment

    var vars = {}
    for (const iid in form.inputs) {
        if (form.inputs.hasOwnProperty(iid)) {
            vars[iid] = 0
        }
    }
    var [outputs, update] = genOutputs(form, vars)
    var inputs = genInputs(form, vars, update)
    ediv.append(eheader,ecomment,inputs,outputs)

    return ediv
}

function genForms(forms) {
    var eo = document.getElementById("forms")
    for (const form of forms) {
        eo.appendChild(genForm(form))
    }
}