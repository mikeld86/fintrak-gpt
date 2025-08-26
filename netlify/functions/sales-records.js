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
    const userId = "46429020";

    if (httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('sales_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data || [])
      };
    }

    if (httpMethod === 'POST') {
      const requestData = JSON.parse(event.body);
      
      // Map frontend camelCase to database snake_case  
      const dbData = {
        user_id: userId,
        batch_id: requestData.batchId,
        qty: requestData.qty || requestData.quantity,
        price_per_unit: requestData.pricePerUnit || requestData.price_per_unit,
        total_price: requestData.totalPrice || requestData.total_price,
        amount_paid: requestData.amountPaid || requestData.amount_paid,
        notes: requestData.notes || ''
      };
      
      const { data, error } = await supabase
        .from('sales_records')
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(data)
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