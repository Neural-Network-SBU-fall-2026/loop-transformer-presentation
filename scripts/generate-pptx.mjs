import pptxgen from "pptxgenjs";
import {mkdir,access} from "node:fs/promises";
import {constants} from "node:fs";
const A="public/assets/";
const fig=(n)=>A+"paper-original/figures/figure-"+String(n).padStart(3,"0")+"-page-"+({1:"002",2:"005",3:"006",4:"007",5:"007",6:"008",7:"008",8:"009"}[n])+".png";
const table=A+"paper-original/tables/table-001-page-026.png";
const data=[
["Want a smarter model? Make it bigger.",["More parameters","More data","More training compute"],"Scale became the default capability lever.",""],
["Scaling works — but the budget has three dimensions.",["Kaplan: empirical scaling trends","Chinchilla: compute-optimal model/data balance","Bigger is not automatically better at fixed compute"],"Parameters × Data × Compute",""],
["The bottleneck is no longer just model quality.",["Weight memory","Training FLOPs","Serving latency and energy"],"Scaling is a systems problem too.",""],
["Researchers learned to spend computation differently.",["MoE: activate selected experts","Distillation: transfer behaviour","Quantization / pruning / sharing"],"Different methods target different bottlenecks.",""],
["Do we need new weights for every computational step?",["A new layer usually brings new parameters","A repeated block reuses learned weights","The hidden representation still changes"],"Can depth be executed rather than fully stored?",""],
["100 layers — or 25 layers run four times?",["100 independent blocks","25 shared blocks × 4 passes","100 block applications; fewer unique base blocks"],"CONCEPTUAL ILLUSTRATION — NOT A PAPER EXPERIMENT",""],
["Same weights. A new hidden state on every pass.",["H(0) = Embedding(X)","H(k+1) = Tθ(H(k))","Y = LMHead(H(L))"],"Shared parameters. Recurrent computation. Changing state.",""],
["Where you put the loop changes the computation.",["Joint / Attention-only / MLP-only / Independent","Full-Stack and Per-Layer","Middle-Stack and Middle-Layer"],"Original Figure 2","FIG2"],
["More loops help — until the returns diminish.",["DCLM BPB: lower is better","Gains depend on architecture and training budget","1B sweeps reach at most four loops"],"Original Figure 3 · loop scaling","FIG3"],
["Share the backbone. Let each loop adapt.",["Shared base matrix W","Loop-specific low-rank BA correction","Rank ≤ 8 in reported setup"],"W(l) = W + (α/r)B(l)A(l)","FIG4"],
["A loop can mix a pool of low-rank components.",["M is L × L","Each loop combines low-rank components","Loop Softmax constrains each row"],"ΔW(l) = Σ M(l,j)B(j)A(j)","FIG5"],
["Weight sharing does not remove sequential latency.",["Same-token recurrence","Each loop waits for the previous loop","Autoregressive generation pays sequential work"],"Loop ℓ at token n waits for loop ℓ−1 at token n.",""],
["Shift the connection across token positions.",["Ordinary: same-token dependency","Shifted: previous-token state","Parallelism changes the information path"],"b(n,l) = e(n) + h(n−1,l−1)","FIG6"],
["Two vectors can enter the same sum at different scales.",["Separate RMS normalization","Preserve current-token embedding","Control the mixture with a gate"],"b = g ⊙ RMSNorm(e) + (1−g) ⊙ RMSNorm(h)","FIG7"],
["Parallelism and cache compression solve different problems.",["Shared global KV cache","Loop-local sliding-window cache","Gated global/local attention fusion"],"CLP changes dependencies; KV sharing targets cache memory.",""],
["A controlled study across scale and training budget.",["70M to 1B parameters","10–160 tokens per parameter","DCLM validation: approximately 41M tokens"],"Original Table 1 · model configurations","TABLE1"],
["There is no universally best loop.",["Full-Stack: strong at fixed parameter/data budgets","Middle-Stack: useful under constrained FLOPs","Efficiency estimates rely on fitted scaling laws"],"Original Figure 1 · results and trade-offs","FIG1"]
];
await mkdir("exports",{recursive:true});
const pptx=new pptxgen();pptx.layout="LAYOUT_WIDE";pptx.author="Neural Networks — SBU";pptx.subject="How to Loop Your Transformer";pptx.title="How to Loop Your Transformer";pptx.theme={headFontFace:"Georgia",bodyFontFace:"Aptos",lang:"en-US"};
for(let i=0;i<data.length;i++){
 const[t,bullets,claim,asset]=data[i],s=pptx.addSlide();s.background={color:"F4F6F7"};
 s.addText("NEURAL SYSTEMS  /  SCIENTIFIC PRESENTATION",{x:.55,y:.22,w:7,h:.2,fontFace:"Aptos Mono",fontSize:8,color:"52627A",charSpacing:1.2});
 s.addShape(pptx.ShapeType.line,{x:.55,y:.52,w:12.2,h:0,line:{color:"B9C8D4",width:1}});
 s.addText(String(i+1).padStart(2,"0")+"  /  17",{x:11.5,y:.22,w:1.2,h:.2,fontSize:8,color:"52627A",align:"right"});
 s.addText(t,{x:.7,y:.85,w:11.8,h:1.05,fontFace:"Georgia",fontSize:27,bold:true,color:"101827",fit:"shrink"});
 s.addText(bullets.map(x=>"→  "+x).join("\n"),{x:.9,y:2.15,w:5.7,h:2.45,fontFace:"Aptos",fontSize:15,color:"26364A",breakLine:false,paraSpaceAfterPt:13});
 let path="";
 if(asset==="FIG1")path=fig(1);if(asset==="FIG2")path=fig(2);if(asset==="FIG3")path=fig(3);if(asset==="FIG4")path=fig(4);if(asset==="FIG5")path=fig(5);if(asset==="FIG6")path=fig(6);if(asset==="FIG7")path=fig(7);if(asset==="TABLE1")path=table;
 if(path){try{await access(path,constants.R_OK);s.addImage({path,x:6.65,y:1.95,w:5.95,h:4.15});}catch{s.addText(claim,{x:6.9,y:2.4,w:5.4,h:2.3,fontSize:17,color:"173D79",bold:true,align:"center",valign:"mid",fit:"shrink"});}}
 else{s.addShape(pptx.ShapeType.roundRect,{x:6.9,y:2.1,w:5.35,h:2.9,rectRadius:.03,line:{color:"B9C8D4",width:1},fill:{color:"F9FBFC"}});s.addText(claim,{x:7.25,y:2.7,w:4.65,h:1.7,fontFace:"Georgia",fontSize:19,bold:true,color:asset.includes("CONCEPTUAL")?"9B7C17":"173D79",align:"center",valign:"mid",fit:"shrink"});}
 s.addText("HOW TO LOOP YOUR TRANSFORMER",{x:.7,y:7.05,w:6,h:.18,fontFace:"Aptos Mono",fontSize:8,color:"718096",charSpacing:1});
}
await pptx.writeFile({fileName:"exports/How-to-Loop-Your-Transformer.pptx"});
console.log("Generated 17-slide editorial PowerPoint.");
