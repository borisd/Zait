class Event
  def initialize(data)
    @events = []

    for i in data do
      ms   = calc_time(i["gt"])
      name = get_name(i["id"])
      next unless name.present?
      sun  = i["jt"]
      @events << { 'ms' => ms, 'name' => name, 'sun' => sun }
    end
    @events.sort! { |a,b| a["ms"] <=> b["ms"] }
  end

  def to_a
    @events
  end


  private
  DICT = {
    'CHAA_YOM'                    => '',
    'SOF_KRIAT_CHEMA_HOUMRA_MGA'  => 'Kriat shma',
    'SOF_KRIAT_CHEMA_MGA'         => 'Kriat shma',
    'SOF_KRIAT_CHEMA_GRA'         => 'Kriat shma',
    'SOF_TEFILA_GRA'              => 'Tfila',
    'HATSOT_YOM_ASTRONOMY'        => 'Mid day astronomical',
    'HATSOT_YOM_ZMANIT'           => '',
    'MINHA_GDOLA_GRA'             => 'Large minha',
    'MINHA_KTANA_GRA'             => 'Small minha',
    'PLAG_HAMINHA_GRA'            => 'Plag minha',
    'HADLAKAT_NEROT_CHABBAT_ALEF' => 'Shabat candles A',
    'HADLAKAT_NEROT_CHABBAT_BET'  => 'Shabat candles B',
    'CHKYA'                       => '',
  
  }

  def get_name(name)
    DICT[name] or ''
  end

  def calc_time(str)
    date = Date.today
    split = str.split(':')

    result = Time.utc(date.year, date.month, date.day).to_i

    result += split[0].to_i * 60 * 60
    result += split[1].to_i * 60
    result += split[2].to_i

    result
  end

end
