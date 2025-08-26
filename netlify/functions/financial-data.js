const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { httpMethod } = event;
    const userId = 1;

    if (httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('financial_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data || {})
      };
    }

    if (httpMethod === 'POST' || httpMethod === 'PUT') {
      const requestData = JSON.parse(event.body);
      
      const { data, error } = await supabase
        .from('financial_data')
        .upsert({
          user_id: userId,
          ...requestData
        })
        .select()
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }

    if (httpMethod === 'DELETE') {
      const { error } = await supabase
        .from('financial_data')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};