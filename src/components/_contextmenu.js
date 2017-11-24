import template from "../../node_modules/art-template/lib/template-web.js";
d3.select(".graph-contextmenu").remove();
let contextmenu = d3.select("body").append("div").attr("class", "graph-contextmenu");
export default function() {
    return {
        contextmenu,
        showContextMenu: function(obj) {
            let contextMenuTpl = `
			<div class="title">
			   {{title}}    
			</div>
			<table class="context-menu-item">
			    {{each list listItem}}
			      <tr>
			          <td>
			              <span class="menu-item-btn {{listItem.class}}">{{listItem.text}}</span>
			          </td>
			      </tr>
			    {{/each}}
			</div>
     	`;

            if (obj) {
                contextmenu.html(template.render(contextMenuTpl, obj.contextmenuData))
                .style("left",`${d3.event.pageX}px`)
                .style("top",`${d3.event.pageY}px`)
                .style("display","block")
            } else {
                contextmenu.style("display", "none");
            }

        }
    }
}