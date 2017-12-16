import { downloadExl } from './_exportExcel.js'; //导出excel模块

export default {
    //自动缩放
    autoZoom: function (json) {
        zoomTimeout && clearTimeout(zoomTimeout);
        let zoomTimeout = setTimeout(function () {
            let yMin = +Infinity,
                yMax = -Infinity,
                defaultScale = 1;
            json.nodes.forEach(function (d) {
                if (d["y"] < yMin) yMin = d["y"];
                if (d["y"] > yMax) yMax = d["y"];
            });
            let graphOffsetHeight = +yMax - +yMin,
                graphClientHeight = $(".graph-area").height();
            let scale = 1 / (graphOffsetHeight / graphClientHeight);
            zoomInterval && clearInterval(zoomInterval);
            let zoomInterval = setInterval(function () {
                if (defaultScale > scale) {
                    defaultScale -= 0.05;
                    d3.zoom().on("zoom", () => {
                        d3.select('.all').attr("transform", () => (d3.event.transform))
                    }).scaleTo(d3.select("#J_SvgView"), defaultScale)
                } else {
                    clearInterval(zoomInterval);
                }
            })
        }, 700);
    },
    //导出excel
    exportExcel: function (json) {
        if (json["links"].length) {
            let convertData = JSON.parse(JSON.stringify(json["links"]));
            let convertDataExtract = [];
            convertData.forEach(function (d, i) {
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
    tip: function (msg) {
        dTimer && clearTimeout(dTimer);
        let d = dialog({content: msg}).show();
        let dTimer = setTimeout(() => {
            d.close().remove()
        }, 2000);
    },
    //获取transform
    getTranslateAndScale() {
        let transform = $(".all").attr("transform");
        let matchArr = transform && /translate/.test(transform) && /scale/.test(transform) && transform.match(/translate\(([^\)]+)\)\s?scale\(([^\)]+)/);
        let translate = matchArr && matchArr[1].split(",") || [0, 0];
        let scale = matchArr && matchArr[2] || 1;
        return {translate, scale}
    },
    //动画设置
    initAnimate: function (endCordinates) {
        let circleLayoutTimer;
        d3.selectAll(".node").each(function (nodeItem, nodeIdx) {
            d3.select(this).transition().duration(700).ease(d3.easeCircleInOut).attr("transform", `translate(${endCordinates['x' + nodeIdx]},${endCordinates['y' + nodeIdx]})`)
        });
        d3.selectAll(".link").each(function (nodeItem, nodeIdx) {
            d3.select(this).transition().duration(700).ease(d3.easeCircleInOut)
                .attr('x1', endCordinates['x' + nodeItem["source"]["index"]])
                .attr('y1', endCordinates['y' + nodeItem["source"]["index"]])
                .attr('x2', endCordinates['x' + nodeItem["target"]["index"]])
                .attr('y2', endCordinates['y' + nodeItem["target"]["index"]]);
        });
        circleLayoutTimer && clearTimeout(circleLayoutTimer);
        circleLayoutTimer = setTimeout(function () {
            d3.selectAll(".node").each(function (nodeItem, nodeIdx) {
                nodeItem.x = endCordinates['x' + nodeIdx];
                nodeItem.y = endCordinates['y' + nodeIdx];
                nodeItem.fx = nodeItem.x;
                nodeItem.fy = nodeItem.y;
            });
        }, 350);
    },
    //设置圆形布局
    circleLayout(json){
        if (json["nodes"].length) {
            let centerPoint = [$('.graph-area').width() / 2, $('.graph-area').height() / 2];
            let radian = 360 / json.nodes.length * Math.PI / 180;
            let radius = json["nodes"].length * 10;
            let endCordinates = {};
            json.nodes.forEach(function (nodeItem, nodeIdx) {
                endCordinates['x' + nodeIdx] = radius * Math.cos(radian * nodeIdx) + centerPoint[0];
                endCordinates['y' + nodeIdx] = radius * Math.sin(radian * nodeIdx) + centerPoint[1];
            });
            this.initAnimate(endCordinates);
        }
    },
    //设置矩形布局
    rectLayout(json){
        if (json["nodes"].length) {
            let endCordinates = {};
            let sqr = Math.floor(Math.sqrt(json["nodes"].length));
            let count4row = 0;
            let row = 0;
            d3.selectAll('.node').each(function (d, i) {
                endCordinates['x' + i] = $('.graph-area').width() * 1 / 5 + count4row * ($('.graph-area').width() * 4 / 5 / (sqr));
                endCordinates['y' + i] = $('.graph-area').height() * 1 / 6 + row * ($('.graph-area').height() * 5 / 6 / (sqr + 2));
                if (count4row < sqr - 1) {
                    count4row++;
                } else {
                    count4row = 0;
                    row++;
                }
            });
            this.initAnimate(endCordinates);
        }
    }
}   