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
    'CHAA_LAYLA'                  => '',
    'ZRICHA'                      => '',
    "ALOT_19_75DEG_90MIN" 	  => 'Alot hashahar',
    "ALOT_16_1DEG_72MIN" 	  => '',
    "ALOT_11_5DEG_60MIN"          => '',
    "ZRICHA"                      => '',
    "TSET_HACOCHAVIM_ALEF_3_55DEG" => 'Stars out alef',
    "TSET_HACOCHAVIM_BET_4_5DEG"  => 'Stars out bet',
    "SOF_TAANIT_DERABANAN"        => 'End of taanit',
    "TSET_HACHABBAT_8_5DEG_36MIN" => 'End of shabat',
    "TSET_HACOCHAVIM_RABENOU_TAM_16_1DEG_72MIN" => '',
    "HATSOT_LAYLA"                => '',
  
  }

  def get_name(name)
    resolv = DICT[name]
    resolv = name if resolv.nil?
    resolv
  end

  def calc_time(str)
    date = Date.today
    split = str.split(':')

    result = Time.utc(date.year, date.month, date.day).to_i

    result += split[0].to_i * 60 * 60
    result += split[1].to_i * 60
    result += split[2].to_i

    puts "Calc time: #{str} = #{result}"

    result
  end

end
