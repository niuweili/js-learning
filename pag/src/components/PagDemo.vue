<template>
    <h1>pageDemo</h1>
    <div>
        <canvas
            class="canvas"
            id="pag"
        ></canvas>
    </div>
</template>
  
<script setup>
import { onMounted } from 'vue'
// import { PAGInit } from 'libpag';
async function initPag() {
    const PAG = await window.libpag.PAGInit()
    const url = 'http://res-static.inframe.mobi/ui/168930774880733.pag';
    const blob = await fetch(url).then((response) => response.blob())
    const file = new window.File([blob], url.replace(/(.*\/)*([^.]+)/i, '$2'));
    const pagFile = await PAG.PAGFile.load(file);
    document.getElementById('pag').width = pagFile.width();
    document.getElementById('pag').height = pagFile.height();
    const pagView = await PAG.PAGView.init(pagFile, '#pag');
    pagView.setRepeatCount(0);
    await pagView.play();
}

onMounted(() => {
    initPag()
})

</script>
  
<style></style>
  