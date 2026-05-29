import { useState } from "react";

var MEALS = [
  {name:"Egg Fried Rice",desc:"Quick and satisfying fried rice with scrambled eggs and veggies.",ing:["rice","eggs","soy sauce","garlic","green onion"],time:"15 min"},
  {name:"Avocado Toast",desc:"Creamy smashed avocado on crispy toast with chili flakes.",ing:["bread","avocado","lemon","chili flakes","salt"],time:"10 min"},
  {name:"Tomato Pasta",desc:"Classic pasta in a rich garlic tomato sauce.",ing:["pasta","tomatoes","garlic","olive oil","basil"],time:"20 min"},
  {name:"Chicken Wrap",desc:"Tortilla stuffed with melty cheese and seasoned chicken.",ing:["tortilla","chicken","cheese","bell pepper","salsa"],time:"15 min"},
  {name:"Veggie Omelette",desc:"Fluffy omelette packed with colorful vegetables.",ing:["eggs","onion","bell pepper","mushrooms","cheese"],time:"10 min"},
  {name:"Tuna Sandwich",desc:"Creamy tuna salad sandwich with a satisfying crunch.",ing:["bread","tuna","mayo","celery","lettuce"],time:"5 min"},
  {name:"Miso Soup and Rice",desc:"Comforting Japanese-style miso soup with steamed rice.",ing:["rice","miso paste","tofu","seaweed","green onion"],time:"15 min"},
  {name:"Greek Salad",desc:"Fresh and tangy salad with olives, feta, and cucumber.",ing:["cucumber","tomato","olives","feta","red onion"],time:"5 min"},
  {name:"Stir-Fried Noodles",desc:"Savory noodles tossed with veggies in sesame soy sauce.",ing:["noodles","soy sauce","sesame oil","carrot","cabbage"],time:"20 min"},
  {name:"Potato and Egg Hash",desc:"Crispy pan-fried potatoes with eggs.",ing:["potato","eggs","onion","butter","paprika"],time:"25 min"},
  {name:"BLT Sandwich",desc:"The classic bacon, lettuce, and tomato sandwich.",ing:["bread","bacon","lettuce","tomato","mayo"],time:"10 min"},
  {name:"Lentil Soup",desc:"Hearty lentil soup with cumin and lemon.",ing:["lentils","onion","tomato","cumin","lemon"],time:"30 min"},
  {name:"Caprese Salad",desc:"Simple Italian salad with fresh mozzarella and basil.",ing:["tomato","mozzarella","basil","olive oil","balsamic"],time:"5 min"},
  {name:"Kimchi Fried Rice",desc:"Tangy kimchi fried rice with a fried egg on top.",ing:["rice","kimchi","eggs","soy sauce","sesame oil"],time:"15 min"},
  {name:"PB Banana Wrap",desc:"Quick wrap with peanut butter and banana slices.",ing:["tortilla","peanut butter","banana","honey","oats"],time:"5 min"},
  {name:"Mushroom Risotto",desc:"Creamy Italian rice dish with earthy mushroom flavor.",ing:["arborio rice","mushrooms","parmesan","white wine","onion"],time:"35 min"},
  {name:"Vegetable Curry",desc:"Fragrant and warming curry with mixed vegetables.",ing:["potato","chickpeas","coconut milk","curry powder","tomato"],time:"30 min"},
  {name:"Shakshuka",desc:"Eggs poached in a spiced tomato and pepper sauce.",ing:["eggs","tomatoes","bell pepper","cumin","chili"],time:"20 min"},
  {name:"Chicken Salad Bowl",desc:"Grilled chicken over fresh mixed greens.",ing:["chicken","lettuce","cucumber","tomato","dressing"],time:"20 min"},
  {name:"Cheese Toastie",desc:"Golden grilled cheese sandwich, simple and irresistible.",ing:["bread","cheese","butter","mustard"],time:"8 min"}
];

var purple = "#7c3aed";
var purpleLight = "#f3e8ff";
var purpleMid = "#a855f7";
var green = "#d1fae5";
var greenText = "#065f46";
var greenBorder = "#6ee7b7";

function Card({ meal, showMatch, showReroll, onReroll, onSave, saved }) {
  return (
    <div style={{background:"white",borderRadius:20,padding:"28px 24px",boxShadow:"0 8px 32px rgba(0,0,0,0.10)"}}>
      <div style={{display:"inline-block",background:purple,color:"white",borderRadius:20,padding:"4px 14px",fontSize:13,fontWeight:700,marginBottom:12}}>{meal.time}</div>
      <h2 style={{fontSize:22,fontWeight:700,textAlign:"center",color:"#1a1a1a",marginBottom:8}}>{meal.name}</h2>
      {showMatch && (
        <div style={{textAlign:"center",marginBottom:8}}>
          <span style={{background:green,color:greenText,borderRadius:20,padding:"3px 12px",fontSize:13,fontWeight:600}}>
            Matches {meal.matchCount} ingredient{meal.matchCount > 1 ? "s" : ""} you have
          </span>
        </div>
      )}
      <p style={{color:"#555",textAlign:"center",fontSize:15,lineHeight:1.5,marginBottom:16}}>{meal.desc}</p>
      <div style={{background:"#f9f5ff",borderRadius:12,padding:"12px 16px",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:purple,letterSpacing:1,marginBottom:8}}>INGREDIENTS</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {meal.ing.map(function(ing, i) {
            var matched = showMatch && meal.matched && meal.matched.indexOf(ing) >= 0;
            return (
              <span key={i} style={{
                background: matched ? green : "white",
                border: "1px solid " + (matched ? greenBorder : "#e9d5ff"),
                borderRadius:20, padding:"3px 10px", fontSize:13, color:"#374151"
              }}>{ing}</span>
            );
          })}
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        {showReroll && (
          <button onClick={onReroll} style={{flex:1,padding:"12px 0",borderRadius:12,border:"2px solid "+purple,background:"white",color:purple,fontWeight:700,fontSize:15,cursor:"pointer"}}>
            Try another
          </button>
        )}
        <button onClick={onSave} style={{padding:"12px 18px",borderRadius:12,border:"none",background:saved?purple:purpleLight,color:saved?"white":purple,fontWeight:700,fontSize:15,cursor:"pointer"}}>
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  var [tab, setTab] = useState("random");
  var [meal, setMeal] = useState(null);
  var [fridge, setFridge] = useState("");
  var [fridgeResults, setFridgeResults] = useState([]);
  var [favorites, setFavorites] = useState([]);

  function isSaved(name) { return favorites.some(function(f) { return f.name === name; }); }

  function getRandom() {
    var pool = MEALS.filter(function(m) { return !meal || m.name !== meal.name; });
    setMeal(pool[Math.floor(Math.random() * pool.length)]);
    setTab("random");
  }

  function searchFridge() {
    var text = fridge.toLowerCase();
    var userIngs = text.split(/[,\s]+/).filter(Boolean);
    var results = MEALS.map(function(m) {
      var matched = m.ing.filter(function(i) {
        return userIngs.some(function(u) { return i.indexOf(u) >= 0 || u.indexOf(i) >= 0; });
      });
      return Object.assign({}, m, {matchCount: matched.length, matched: matched});
    }).filter(function(m) { return m.matchCount > 0; })
      .sort(function(a, b) { return b.matchCount - a.matchCount; })
      .slice(0, 4);
    setFridgeResults(results);
  }

  function saveMeal(m) {
    if (!isSaved(m.name)) setFavorites(function(prev) { return [m].concat(prev); });
  }

  var navItems = [
    {id:"random", label:"Random"},
    {id:"fridge", label:"My Fridge"},
    {id:"favorites", label:"Saved (" + favorites.length + ")"}
  ];

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#f5f3ff,#ede9fe)",fontFamily:"'Segoe UI',sans-serif",paddingBottom:40}}>
      <div style={{maxWidth:420,margin:"0 auto",padding:"0 16px"}}>
        <div style={{textAlign:"center",paddingTop:36,paddingBottom:24}}>
          <h1 style={{fontSize:26,fontWeight:800,color:"#1a1a1a",margin:"8px 0 4px"}}>Lunch Decider</h1>
          <p style={{color:"#6b7280",fontSize:14,margin:0}}>No more staring at the fridge.</p>
        </div>

        <div style={{display:"flex",gap:8,marginBottom:24}}>
          {navItems.map(function(n) {
            return (
              <button key={n.id} onClick={function() { setTab(n.id); }} style={{
                flex:1, padding:"10px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, cursor:"pointer",
                background: tab === n.id ? purple : "white",
                color: tab === n.id ? "white" : "#6b7280",
                boxShadow:"0 2px 8px rgba(0,0,0,0.07)"
              }}>{n.label}</button>
            );
          })}
        </div>

        {tab === "random" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <button onClick={getRandom} style={{width:"100%",padding:"22px 0",borderRadius:20,border:"none",background:"linear-gradient(135deg,"+purple+","+purpleMid+")",color:"white",fontSize:20,fontWeight:800,cursor:"pointer",boxShadow:"0 8px 24px rgba(124,58,237,0.35)"}}>
              Roll the Dice!
            </button>
            {meal && <Card meal={meal} showMatch={false} showReroll={true} onReroll={getRandom} onSave={function() { saveMeal(meal); }} saved={isSaved(meal.name)} />}
          </div>
        )}

        {tab === "fridge" && (
          <div>
            <div style={{background:"white",borderRadius:20,padding:20,boxShadow:"0 4px 16px rgba(0,0,0,0.08)",marginBottom:16}}>
              <label style={{fontWeight:700,color:"#1a1a1a",fontSize:15,display:"block",marginBottom:8}}>What's in your fridge?</label>
              <textarea value={fridge} onChange={function(e) { setFridge(e.target.value); }}
                placeholder="e.g. eggs, rice, tomato, garlic, cheese..."
                rows={4} style={{width:"100%",borderRadius:12,border:"1.5px solid #e5e7eb",padding:"10px 12px",fontSize:14,resize:"none",outline:"none",fontFamily:"inherit",color:"#374151",boxSizing:"border-box"}}
              />
              <button onClick={searchFridge} disabled={!fridge.trim()} style={{
                marginTop:12, width:"100%", padding:"14px 0", borderRadius:12, border:"none",
                background:"linear-gradient(135deg,"+purple+","+purpleMid+")", color:"white",
                fontSize:16, fontWeight:700, cursor:fridge.trim()?"pointer":"not-allowed", opacity:fridge.trim()?1:0.6
              }}>What can I make?</button>
            </div>
            {fridgeResults.length === 0 && fridge && (
              <div style={{textAlign:"center",padding:32,background:"white",borderRadius:20,boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}}>
                <p style={{fontWeight:700,color:"#1a1a1a",marginBottom:4}}>No matches found</p>
                <p style={{fontSize:14,color:"#6b7280"}}>Try more ingredients like eggs, rice, or pasta.</p>
              </div>
            )}
            {fridgeResults.length > 0 && (
              <div>
                <p style={{fontWeight:700,color:"#374151",fontSize:15,marginBottom:12}}>Found {fridgeResults.length} meal{fridgeResults.length > 1 ? "s" : ""} you can make!</p>
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  {fridgeResults.map(function(m, i) {
                    return <Card key={i} meal={m} showMatch={true} showReroll={false} onSave={function() { saveMeal(m); }} saved={isSaved(m.name)} />;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "favorites" && (
          favorites.length === 0 ? (
            <div style={{textAlign:"center",padding:48,color:"#9ca3af"}}>
              <p style={{fontWeight:600,marginBottom:8}}>No saved meals yet.</p>
              <p style={{fontSize:14}}>Roll the dice or use My Fridge and save meals you love!</p>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {favorites.map(function(f, i) {
                return (
                  <div key={i} style={{background:"white",borderRadius:16,padding:"16px 18px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
                    <div style={{fontWeight:700,fontSize:15,color:"#1a1a1a"}}>{f.name}</div>
                    <div style={{fontSize:12,color:"#9ca3af",marginBottom:6}}>{f.time}</div>
                    <p style={{fontSize:13,color:"#6b7280",lineHeight:1.5,marginBottom:8}}>{f.desc}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {f.ing.map(function(ing, j) {
                        return <span key={j} style={{background:purpleLight,borderRadius:20,padding:"2px 8px",fontSize:12,color:purple}}>{ing}</span>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
