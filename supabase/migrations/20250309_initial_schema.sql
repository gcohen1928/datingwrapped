-- Create dating entries table
CREATE TABLE IF NOT EXISTS dating_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  person_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  num_dates INTEGER NOT NULL DEFAULT 1,
  total_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  avg_duration DECIMAL(5, 2) NOT NULL DEFAULT 0,
  rating INTEGER NOT NULL DEFAULT 0,
  outcome TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wrapped shares table
CREATE TABLE IF NOT EXISTS wrapped_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE dating_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wrapped_shares ENABLE ROW LEVEL SECURITY;

-- Create policies for dating_entries
CREATE POLICY "Users can view their own entries" 
  ON dating_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries" 
  ON dating_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" 
  ON dating_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" 
  ON dating_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for wrapped_shares
CREATE POLICY "Users can view their own shares" 
  ON wrapped_shares 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Public shares are viewable by everyone" 
  ON wrapped_shares 
  FOR SELECT 
  USING (is_public = TRUE);

CREATE POLICY "Users can insert their own shares" 
  ON wrapped_shares 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shares" 
  ON wrapped_shares 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shares" 
  ON wrapped_shares 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_dating_entries_user_id ON dating_entries(user_id);
CREATE INDEX idx_wrapped_shares_user_id ON wrapped_shares(user_id);
CREATE INDEX idx_wrapped_shares_is_public ON wrapped_shares(is_public); 