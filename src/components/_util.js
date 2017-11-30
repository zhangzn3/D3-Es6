import { downloadExl } from './_exportExcel.js'; //导出excel模块

export default {
    //自动缩放
    autoZoom: function(json) {
        zoomTimeout && clearTimeout(zoomTimeout);
        let zoomTimeout = setTimeout(function() {
            let yMin = +Infinity,
                yMax = -Infinity,
                defaultScale = 1;
            json.nodes.forEach(function(d) {
                if (d["y"] < yMin) yMin = d["y"];
                if (d["y"] > yMax) yMax = d["y"];
            });
            let graphOffsetHeight = +yMax - +yMin,
                graphClientHeight = $(".graph-area").height();
            let scale = 1 / (graphOffsetHeight / graphClientHeight);
            zoomInterval && clearInterval(zoomInterval);
            let zoomInterval = setInterval(function() {
                if (defaultScale > scale) {
                    defaultScale -= 0.05;
                    d3.zoom().on("zoom", () => { d3.select('.all').attr("transform", () => (d3.event.transform)) }).scaleTo(d3.select("#J_SvgView"), defaultScale)
                } else {
                    clearInterval(zoomInterval);
                }
            })
        }, 700);
    },
    //导出excel
    exportExcel: function(json) {
        if (json["links"].length) {
            let convertData = JSON.parse(JSON.stringify(json["links"]));
            let convertDataExtract = [];
            convertData.forEach(function(d, i) {
                convertDataExtract[i] = {};
                convertDataExtract[i]["源点"] = d["source"]["id"];
                convertDataExtract[i]["目标"] = d["target"]["id"];
            });
            downloadExl(convertDataExtract);
        } else {
            this.tip("没有连接线数据可导出！");
        }
    },
    //消息提示
    tip: function(msg) {
        dTimer && clearTimeout(dTimer);
        let d = dialog({ content: msg }).show();
        let dTimer = setTimeout(() => { d.close().remove() }, 2000);
    },
    getTranslateAndScale() {
        let transform = $(".all").attr("transform");
        let matchArr = transform && /translate/.test(transform) && /scale/.test(transform) && transform.match(/translate\(([^\)]+)\)\s?scale\(([^\)]+)/);
        let translate = matchArr && matchArr[1].split(",") || [0, 0]
        let scale = matchArr && matchArr[2] || 1;
        return {translate,scale}
    }
}   