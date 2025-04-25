
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle } from "lucide-react";

interface StorySegment {
  id: number;
  text: string;
  notes: string;
}

interface StoryTabProps {
  currentStorySegment: number;
  storySegments: StorySegment[];
  setCurrentStorySegment: (index: number) => void;
  addStorySegment: () => void;
}

const StoryTab = ({ 
  currentStorySegment, 
  storySegments, 
  setCurrentStorySegment, 
  addStorySegment 
}: StoryTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 fantasy-card">
        <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Narrativa Atual</h2>
        <div className="prose prose-invert max-w-none">
          {storySegments[currentStorySegment] && (
            <>
              <p>{storySegments[currentStorySegment].text}</p>
              <div className="mt-4 bg-fantasy-dark/40 p-3 rounded">
                <h3 className="text-sm font-medievalsharp text-fantasy-gold">Notas para o Mestre:</h3>
                <p className="text-sm italic">{storySegments[currentStorySegment].notes}</p>
              </div>
            </>
          )}
        </div>
        <div className="mt-4 flex justify-between">
          <Button 
            onClick={() => setCurrentStorySegment(Math.max(0, currentStorySegment - 1))}
            className="fantasy-button secondary text-sm py-1.5"
            disabled={currentStorySegment === 0}
          >
            Segmento Anterior
          </Button>
          <Button 
            onClick={() => setCurrentStorySegment(Math.min(storySegments.length - 1, currentStorySegment + 1))}
            className="fantasy-button primary text-sm py-1.5"
            disabled={currentStorySegment === storySegments.length - 1}
          >
            Próximo Segmento
          </Button>
        </div>
      </div>
      
      <div className="fantasy-card">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-medievalsharp text-fantasy-purple">Roteiro da Aventura</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={addStorySegment}
            className="h-8 w-8 p-0"
          >
            <PlusCircle size={16} />
          </Button>
        </div>
        <div className="space-y-3">
          {storySegments.map((segment, index) => (
            <div 
              key={segment.id}
              className={`p-3 rounded cursor-pointer ${currentStorySegment === index ? 'bg-fantasy-purple/30 border border-fantasy-purple/60' : 'bg-fantasy-dark/30 hover:bg-fantasy-dark/50'}`}
              onClick={() => setCurrentStorySegment(index)}
            >
              <h3 className="text-sm font-medievalsharp text-fantasy-gold">Segmento {index + 1}</h3>
              <p className="text-xs text-fantasy-stone truncate">{segment.text.substring(0, 60)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryTab;
