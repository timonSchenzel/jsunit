module.exports = class CountdownTest extends VueComponentTestCase
{
    /** @test */
    it_is_able_to_render_the_countdown_component()
    {
        let until = moment().add(10, 'seconds');
        let component = this.render('<countdown :until="until"></countdown>', { until });

        component.assertSee('0 Days');
        component.assertSee('0 Hours');
        component.assertSee('0 Minutes');
        component.assertSee('10 Seconds');
    }

    /** @test */
    it_will_update_the_seconds_proper_after_1_second()
    {
        let until = moment().add(10, 'seconds');
        let component = this.render('<countdown :until="until"></countdown>', { until });

        component.fastForward('1s');

        component.assertSee('0 Days');
        component.assertSee('0 Hours');
        component.assertSee('0 Minutes');
        component.assertSee('9 Seconds');
    }

    /** @test */
    it_will_show_the_proper_expired_text_after_the_countdown_has_completed()
    {
        let until = moment().add(10, 'seconds');
        let component = this.render('<countdown :until="until"></countdown>', { until });

        component.fastForward('10s');

        component.assertSee('Now Expired');
    }
}
