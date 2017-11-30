import contextmenuInit from "../../../components/_contextmenu.js";
import { __delNode,__delLink} from "./_bindEvent.js"
let ct = contextmenuInit();

export default function(json, update, vis, node, link) {

    //节点右键菜单
    node.on("contextmenu", function(d) {
            d.contextmenuData = {
                "title": "操作当前节点",
                "list": [
                    { "class": "node-del", "text": "删除节点" }
                ]
            }
            ct.showContextMenu(d);
            //绑定右键删除节点
            d3.select(".node-del").on("click", function() {
                __delNode(json, update, [d]);
                setTimeout(() => { ct.showContextMenu(null)});
            });
            d3.event.preventDefault();
            d3.event.stopPropagation();
        })
        .on("mouseover", function(d) {
            node.mouseoutTimeout && clearTimeout(node.mouseoutTimeout);
            node.mouseoutTimeout = null;
        })
        .on("mouseout", function(d) {
            node.mouseoutTimeout && clearTimeout(node.mouseoutTimeout);
            node.mouseoutTimeout = setTimeout(() => { ct.showContextMenu(null) }, 100)
        })
        .on("click", function() {
            if ($(this).hasClass('active')) {
                d3.select(this).classed('active', false);
            } else {
                d3.select(this).classed('active', true);
            }
        });

    //连线右键菜单 
    link.on("contextmenu", function(d) {
            d.contextmenuData = {
                "title": "操作当前连线",
                "list": [
                    { "class": "link-del", "text": "删除连线" }
                ]
            }
            ct.showContextMenu(d);
            //绑定右键删除连线
            d3.select(".link-del").on("click", function() {
                __delLink(json, update, [d]);
                setTimeout(() => { ct.showContextMenu(null)});
            });
            d3.event.preventDefault();
            d3.event.stopPropagation();
        })
        .on("click", function() {
            if ($(this).hasClass('active')) {
                d3.select(this).classed('active', false);
            } else {
                d3.select(this).classed('active', true);
            }
        }); 


    ct.contextmenu.on('mouseover', function() {node.mouseoutTimeout && clearTimeout(node.mouseoutTimeout);})
        .on('mouseout', function() {
            node.mouseoutTimeout && clearTimeout(node.mouseoutTimeout);
            node.mouseoutTimeout = setTimeout(() => { ct.showContextMenu(null) }, 100)
        })

}