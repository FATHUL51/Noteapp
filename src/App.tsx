// App.jsx
import { useState, useEffect } from 'react';
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { cn } from "./lib/utils"
import send from "./assets/send.svg"
import lock from "./assets/lock.svg"
import notes from "./assets/bgimage.svg"
import "./App.css"

const COLORS = [
  "#B38BFA", "#FF79F2", "#43E6FC", "#F19576",
  "#0047FF", "#6691FF", "#FF971D"
];

export default function App() {
  const [groups, setGroups] = useState(() => 
    JSON.parse(localStorage.getItem('groups')) || []
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  const createNewGroup = () => {
    if (!groupName.trim() || !selectedColor) return;
    
    const initials = groupName
      .split(' ')
      .map(word => word[0].toUpperCase())
      .join('')
      .slice(0, 2);

    const newGroup = {
      id: Date.now(),
      name: groupName.trim(),
      initials,
      color: selectedColor,
      notes: []
    };

    setGroups(prev => [...prev, newGroup]);
    resetGroupCreation();
  };

  const addNewNote = () => {
    if (!noteInput.trim() || !selectedGroup) return;

    const updatedGroups = groups.map(group => {
      if (group.id === selectedGroup.id) {
        return {
          ...group,
          notes: [...group.notes, {
            text: noteInput.trim(),
            timestamp: new Date().toLocaleString()
          }]
        };
      }
      return group;
    });

    setGroups(updatedGroups);
    setNoteInput('');
  };

  const resetGroupCreation = () => {
    setGroupName('');
    setSelectedColor(null);
    setShowColorPicker(false);
  };

  return (
    <div id='grid'>
      <div  id='leftside'>
        <h1  id='title'>Pocket Notes</h1>
        
        <div id='groupcontainer'>
          {groups.map(group => (
            <div
              key={group.id}
              onClick={() => setSelectedGroup(group)
                
              }
              id='groupid'
            >
              <div
                id='groupinitials'
                style={{ backgroundColor: group.color }}
              >
                {group.initials}
              </div>
              <div id="name">{group.name}</div>
            </div>
          ))}
        </div>

        <Button
          variant="default"
          id='addgroupicon'
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          +
        </Button>
        

        {showColorPicker && (
          
          <div  id='entername'>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              id="idname"
            />
            <div className="flex flex-wrap gap-2 mb-3" id='colorpicker'>
              {COLORS.map(color => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    " colorring",
                    selectedColor === color && "colorring2"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Button
              id='createbutton'
              disabled={!groupName.trim() || !selectedColor}
              onClick={createNewGroup}
            >
              Create
            </Button>
          </div>
        )}
      </div>
      
      <div  id='class'>
        <img 
          src={notes}
          alt="Notes Illustration" 
          id="image"
        />
        <h1  id="heading">Pocket Notes</h1>
        <p  id='paragraph'>
          Send and receive messages without keeping your phone online.<br/>
          Use Pocket Notes on up to 4 linked devices and 1 mobile phone
        </p>
        <p  id="endtoend">
          <img src={lock} alt="" />end-to-end encrypted
        </p>
      </div>
      {selectedGroup && (
        <div  id='rightside'>
          <div id='selectedgroup' style={{ backgroundColor: selectedGroup.color }} >
            <div
              id='selectedgroupinitials'
              style={{ backgroundColor: selectedGroup.color }}
            >
              {selectedGroup.initials}
            </div>
            <div  id="selectedgroupname">{selectedGroup.name}</div>
          </div>

          <div  id="scrollable">
            {selectedGroup.notes.map((note, index) => (
              <div key={index}  id='write'>
                <div id="text">{note.text}</div>
                <div  id="time">{note.timestamp}</div>
              </div>
            ))}
          </div>

          <div  id='inputcontainer'>
            <div id='alltexts'>
              <Input
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Enter your text..."
                id="input"
              />
              <Button
                disabled={!noteInput.trim()}
                onClick={addNewNote}
                id="sendbutton"
              >
                <img src={send} className='w-10 p-1 ' alt="" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}