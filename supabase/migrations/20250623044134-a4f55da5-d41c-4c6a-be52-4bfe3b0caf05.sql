
-- Add a new column for trip sections
ALTER TABLE public.trips 
ADD COLUMN section text DEFAULT 'trending' CHECK (section IN ('trending', 'upcoming', 'mountain', 'packages'));

-- Update existing trips to have a default section
UPDATE public.trips 
SET section = 'trending' 
WHERE section IS NULL;

-- Make the section column non-nullable after setting defaults
ALTER TABLE public.trips 
ALTER COLUMN section SET NOT NULL;

-- Add an index for better performance when filtering by section
CREATE INDEX idx_trips_section ON public.trips(section);

-- Add a new column for day-wise itinerary
ALTER TABLE public.trips 
ADD COLUMN itinerary jsonb DEFAULT '[]'::jsonb;

-- Create a unique constraint to prevent exact duplicates in the same section
CREATE UNIQUE INDEX idx_trips_unique_section_title 
ON public.trips(section, title) 
WHERE section IS NOT NULL AND title IS NOT NULL;
