import pptxgen from "pptxgenjs";
import {mkdir,access} from "node:fs/promises";
import {constants} from "node:fs";
const data=[
["The cost of making a model deeper",["More parameters","More training compute","More deployment pressure"],"Can we get more computation from the same parameters?",""],
["Stored depth ≠ Executed depth",["Unique parameterized blocks","Total block applications","One can grow while the other stays fixed"],"A computation can reuse the same learned transformation.",""],
["Reuse the weights. Recompute the state.",["Shared transformation Tθ","Recurrent hidden-state updates","Changing hidden representations"],"H(k+1) = Tθ(H(k))",""],
["Same blocks. Different execution schedules.",["Joint / attention-only / MLP-only","Full-stack and per-layer","Middle-stack and middle-layer"],"Loop placement changes computation order.","public/assets/figures/01-looping-design-space.svg"],
["More loops help — until they do not.",["BPB: lower is better","Diminishing returns and saturation","1B sweeps reach at most four loops"],"Use original Figure 3 and Appendix E plots. Do not invent values.",""],
["Share the backbone. Specialize the loop.",["Shared base matrix W","Loop-indexed low-rank updates","Rank at most 8 in reported experiments"],"W(l) = W + B(l)A(l)","public/assets/figures/02-loop-matrix.svg"],
["A loop can mix a shared pool of adapters.",["M is L × L","Each loop combines low-rank components","Parameter-efficient, not compute-efficient"],"Loop Matrix: ΔW(l) = Σ M(l,j) B(j)A(j)","public/assets/figures/02-loop-matrix.svg"],
["Repeated computation creates a serial dependency.",["Same-token recurrence","Each loop waits for the previous loop","Autoregressive latency grows with loop count"],"Loop ℓ at token n waits for loop ℓ−1 at token n.",""],
["Shift the connection across token positions.",["Previous-token hidden state","Cross-loop stages can run concurrently","The information path changes"],"b(n,l) = e(n) + h(n−1,l−1)","public/assets/figures/03-plt-dependency-grid.svg"],
["Parallelism and cache compression solve different problems.",["Shared global KV cache","Loop-local sliding window","Gated attention fusion"],"KV sharing + G-SWA target cache memory; CLP targets serial dependency.","public/assets/figures/04-kv-cache-gswa.svg"],
["Adding two vectors does not balance two signals.",["Current-token embedding","Previous-token hidden state","Separate RMSNorm + controlled gate"],"b = g ⊙ RMSNorm(e) + (1−g) ⊙ RMSNorm(h)","public/assets/figures/05-normalized-gated-interface.svg"],
["The repair recovers quality — with important distinctions.",["Shifted PLT is parallelizable","Unshifted control remains sequential","Separate per-loop caches in normalized variants"],"Use original Figures 7–8; distinguish shifted from unshifted.",""],
["A controlled study across scale and budget.",["70M to 1B parameters","10–160 tokens per parameter","DCLM validation: ~41M tokens"],"Dense decoder-only Transformers trained from scratch.",""],
["The best loop depends on the budget.",["Fixed parameter/data budget: Full-Stack","Constrained FLOPs: Middle-Stack","Efficiency estimates use fitted vanilla scaling laws"],"Use original Figure 1; fitted frontier estimates are not wall-clock speedups.",""],
["Looping is a resource-allocation problem.",["Parameter storage","Training FLOPs","Cache memory and decoding latency"],"The next frontier: speculative decoding and stability theory.",""]
];
await mkdir("exports",{recursive:true});
const pptx=new pptxgen();pptx.layout="LAYOUT_WIDE";pptx.author="Neural Networks — SBU";pptx.subject="How to Loop Your Transformer";pptx.title="How to Loop Your Transformer";pptx.theme={headFontFace:"Aptos Display",bodyFontFace:"Aptos",lang:"en-US"};
for(let i=0;i<data.length;i++){
 const[t,bullets,claim,img]=data[i],s=pptx.addSlide();s.background={color:"F7F5EF"};
 s.addText("NEURAL SYSTEMS  /  RESEARCH PRESENTATION",{x:.55,y:.22,w:7,h:.2,fontSize:8,color:"89867E",charSpacing:1.2});
 s.addShape(pptx.ShapeType.line,{x:.55,y:.52,w:12.2,h:0,line:{color:"E4E0D7",width:1}});
 s.addText(String(i+1).padStart(2,"0")+"  /  15",{x:11.5,y:.22,w:1.2,h:.2,fontSize:8,color:"89867E",align:"right"});
 s.addText(t,{x:.7,y:.85,w:11.8,h:1.0,fontFace:"Aptos Display",fontSize:29,bold:true,color:"242622",fit:"shrink"});
 s.addText(bullets.map(x=>"↗  "+x).join("\n"),{x:.9,y:2.15,w:5.8,h:2.2,fontSize:15,color:"33352F",breakLine:false,paraSpaceAfterPt:14,bullet:{indent:14}});
 if(img){try{await access(img,constants.R_OK);s.addImage({path:img,x:6.75,y:2.0,w:5.85,h:3.6,sizingContain:true});}catch{s.addText(claim,{x:7,y:2.4,w:5.3,h:2.4,fontSize:17,color:"D97736",bold:true,align:"center",valign:"mid",fit:"shrink"});}}
 else{s.addShape(pptx.ShapeType.roundRect,{x:7.0,y:2.15,w:5.3,h:2.7,rectRadius:.08,line:{color:"E7E2D8",width:1},fill:{color:"FFFFFF"}});s.addText(claim,{x:7.35,y:2.75,w:4.6,h:1.5,fontFace:"Aptos Display",fontSize:19,bold:true,color:"D97736",align:"center",valign:"mid",fit:"shrink"});}
 s.addText("HOW TO LOOP YOUR TRANSFORMER",{x:.7,y:7.05,w:6,h:.18,fontSize:8,color:"99958C",charSpacing:1});
}
await pptx.writeFile({fileName:"exports/How-to-Loop-Your-Transformer.pptx"});
console.log("Generated 15-slide editable PowerPoint.");
