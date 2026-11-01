using UnityEngine;

[CreateAssetMenu(fileName = "HarvestConfig", menuName = "Game/Harvest Config")]
public class HarvestConfig : ScriptableObject
{
    [Header("حركة المركبة")]
    public float moveSpeed = 5f;        // سرعة الحركة
    public float turnSpeed = 90f;       // سرعة الانعطاف (درجة/ثانية)
    public float acceleration = 3f;     // التسارع

    [Header("الحصاد")]
    public float cutRadius = 2.5f;      // نطاق القطع
    public float destroyDelay = 0.5f;   // تأخير اختفاء العشب المقطوع

    [Header("الاقتصاد")]
    public int scorePerGrass = 10;      // النقاط لكل قطعة عشب
    public int maxCapacity = 20;        // السعة القصوى قبل التفريغ
}
