import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tfhtaqdbqfmuntwdszzj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmaHRhcWRicWZtdW50d2RzenpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MTc1MDYsImV4cCI6MjA5NDE5MzUwNn0.eWluoqyPr74jpa7yhMAEwPru7hsTIr7sk44CAsPWNC8'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const form = document.getElementById('waitlist-form')
const spotsLeftElement = document.getElementById('spots-left')
const successMessage = document.getElementById('success-message')

const MAX_SPOTS = 100

async function updateCounter() {

  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error(error)
    return
  }

  const spotsLeft = Math.max(MAX_SPOTS - count, 0)

  spotsLeftElement.textContent = spotsLeft
}

updateCounter()

form.addEventListener('submit', async (e) => {

  e.preventDefault()

  const formData = new FormData(form)

  const name = formData.get('name')
  const email = formData.get('email')
  const city = formData.get('city')
  const state = formData.get('state')
  const phone = formData.get('phone')
  const social = formData.get('social')

  const { error } = await supabase
    .from('waitlist')
    .insert([
      {
        name,
        email,
        city,
        state,
        phone,
        social
      }
    ])

  if (error) {
    console.error(error)
    successMessage.textContent = 'Something went wrong. Please try again.'
    return
  }

  successMessage.textContent = 'You secured your spot.'

  form.reset()

  updateCounter()

})